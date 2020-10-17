provider "aws" {
  region = "us-west-2"
}

module "dashboard_website" {
  source = "../modules/dashboard_website_core"
  domain_name = random_id.name.hex
  r53_zone_name = random_id.name.hex
  subdomain = var.subdomain
}

resource "random_id" "name" {
  byte_length = 4
  prefix = "${var.domain_name}-"
}
