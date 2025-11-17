provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "backend_bucket" {
  bucket = var.tfstate_backend_bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "backend_bucket" {
  bucket = aws_s3_bucket.backend_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}
