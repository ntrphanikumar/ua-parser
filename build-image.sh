release_version=`cat version.txt`
build_version=`cat version.txt`.$(date '+%Y%m%d')

chmod +x app/run.sh
docker build -t ntrphanikumar/ua-parser:$release_version -t ntrphanikumar/ua-parser:$build_version .
docker push ntrphanikumar/ua-parser --all-tags
