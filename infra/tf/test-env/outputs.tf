output "bucket" {
  value = module.dashboard_website.bucket
}

output "bucket_website_endpoint" {
  value = module.dashboard_website.bucket_website_endpoint
}

output "cf_dist_domain_name" {
  value = aws_cloudfront_distribution.cloudfront_dist.domain_name
}
