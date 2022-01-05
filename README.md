# dashboard
![CI](https://github.com/ScottG489/dashboard/workflows/CI/badge.svg)

My personal dashboard.

## Development
Here is an example of developing the build in conjunction with the application locally.
Make sure you change the file locations of the desired secrets to your actual location.

```bash
./test.sh
```

1. Build the image locally
2. Run the image with the path to your local repository mounted where the code would normally be cloned to

Note that you'll need to comment out the `git clone` in the build otherwise it will fail since you've mounted a directory there
You'll also want to comment out the prod deploy steps (everything after `run-test.sh` is run)
