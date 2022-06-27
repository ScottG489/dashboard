provider "aws" {
  region = "us-west-2"
}

module "dashboard_website" {
  source = "../modules/dashboard_website_core"
  domain_name = random_id.name.hex
  r53_zone_name = random_id.name.hex
  subdomain = var.subdomain
  cf_hosted_zone_id = aws_cloudfront_distribution.cloudfront_dist.hosted_zone_id
  cf_domain_name = aws_cloudfront_distribution.cloudfront_dist.domain_name
}

resource "random_id" "name" {
  byte_length = 4
  prefix = "${var.domain_name}-"
}

resource "aws_cloudfront_distribution" "cloudfront_dist" {
  default_root_object            = "index.html"
  enabled                        = true
  is_ipv6_enabled     = true

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
    cloudfront_default_certificate = true
  }
}
