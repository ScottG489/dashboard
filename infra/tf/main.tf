provider "aws" {
  region = "us-west-2"
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
}

module "helpers_route53_domain_name_servers" {
  source  = "ScottG489/helpers/aws//modules/route53_domain_name_servers"
  version = "0.0.4"
  route53_zone_name = module.dashboard_website.r53_zone_name
  route53_zone_name_servers = module.dashboard_website.r53_zone_name_servers
}
