provider "aws" {
  region = "us-west-2"
}
provider "aws" {
  region = "us-east-1"
  alias = "us_east_1"
}

terraform {
  backend "s3" {
    # TODO: Don't want this hardcoded but backends don't allow variables
    bucket = "tfstate-dashboard"
    key    = "app.tfstate"
    region = "us-west-2"
  }
}

module "dashboard_website" {
  source = "./modules/dashboard_website_core"
  domain_name = var.domain_name
  subdomain = var.subdomain
  r53_zone_name = var.domain_name
  cf_hosted_zone_id = aws_cloudfront_distribution.cloudfront_dist.hosted_zone_id
  cf_domain_name = aws_cloudfront_distribution.cloudfront_dist.domain_name
}

module "helpers_route53_domain_name_servers" {
  source  = "ScottG489/helpers/aws//modules/route53_domain_name_servers"
  version = "1.5.0"
  route53_zone_name = module.dashboard_website.r53_zone_name
  route53_zone_name_servers = module.dashboard_website.r53_zone_name_servers
}

resource "aws_cloudfront_distribution" "cloudfront_dist" {
  // We must wait for the certificate to be valid before creating the CF distribution
  depends_on = [
    aws_acm_certificate_validation.cert_validation
  ]
  default_root_object            = "index.html"
  enabled                        = true
  is_ipv6_enabled     = true

  aliases  = [
    "${var.subdomain}.${var.domain_name}"
  ]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD",]
    cached_methods   = ["GET", "HEAD"]
    // CachingDisabled
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    target_origin_id       = module.dashboard_website.bucket_regional_domain_name
    viewer_protocol_policy = "redirect-to-https"
  }

  origin {
    domain_name = module.dashboard_website.bucket_regional_domain_name
    origin_id = module.dashboard_website.bucket_regional_domain_name
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.acm_cert.arn
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = "sni-only"
  }
}

resource "aws_acm_certificate" "acm_cert" {
  // Certs used with CF need to be in us-east-1
  provider = aws.us_east_1
  domain_name = "${var.subdomain}.${var.domain_name}"
  validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "cert_validation" {
  provider = aws.us_east_1
  certificate_arn         = aws_acm_certificate.acm_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation_r53_record_cname : record.fqdn]
}

resource "aws_route53_record" "cert_validation_r53_record_cname" {
  zone_id = module.dashboard_website.r53_zone_id
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  ttl             = 60

  for_each = {
  for dvo in aws_acm_certificate.acm_cert.domain_validation_options : dvo.domain_name => {
    name   = dvo.resource_record_name
    record = dvo.resource_record_value
    type   = dvo.resource_record_type
  }
  }
}
