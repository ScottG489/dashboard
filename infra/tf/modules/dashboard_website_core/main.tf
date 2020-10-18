resource "aws_route53_zone" "r53_zone" {
  name = var.domain_name
}

module "helpers_s3_website_subdomain" {
  source = "ScottG489/helpers/aws//modules/s3_website_subdomain"
  version = "0.1.0"
  bucket_name = "${var.subdomain}.${var.domain_name}"
  subdomain = var.subdomain
  route53_zone_id = aws_route53_zone.r53_zone.id
}
