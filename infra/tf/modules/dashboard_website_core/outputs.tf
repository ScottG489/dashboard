output "bucket" {
  value = module.helpers_s3_website_subdomain.bucket_name
}

output "bucket_website_endpoint" {
  value = module.helpers_s3_website_subdomain.website_endpoint
}

output "bucket_regional_domain_name" {
  value = module.helpers_s3_website_subdomain.bucket_regional_domain_name
}

output "r53_zone_name" {
  value = aws_route53_zone.r53_zone.name
}

output "r53_zone_id" {
  value = aws_route53_zone.r53_zone.id
}

output "r53_zone_name_servers" {
  value = aws_route53_zone.r53_zone.name_servers
}
