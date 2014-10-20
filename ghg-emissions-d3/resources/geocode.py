import csv
import json
import urllib
import time

# Create a hash/dictionary to lookup restaurants
facility_lookup = {}

# Open the CSV files
with open("../data/ghg-emissions.csv", "rb") as facilities:
  # Create an object to read the file
  reader = csv.reader(facilities)
  # Create and open the output file
  with open("../data/ghg-emissions-geocoded.csv", "wb") as facilities_out:
    # Create a writing object
    writer = csv.writer(facilities_out)
    

    for i, row in enumerate(reader):
      print i
      # If it's the first row, write the header row
      if i == 0:
        writer.writerow((row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], "lat", "lng"))
      
      if row[0] not in facility_lookup and i > 0:
        # Small time out to make sure we don't exceed our API request limit
        time.sleep(0.5)

        searchString = urllib.quote(row[2]) + ',' + urllib.quote(row[3]) + ',' + urllib.quote(row[4]) + ',' + urllib.quote(row[5]) + ',' + urllib.quote(row[6])
        geocoded = json.loads(urllib.urlopen('https://maps.googleapis.com/maps/api/geocode/json?address=' + searchString).read())

        if len(geocoded["results"]) > 0: 
          facility_lookup[row[0]] = {"lat": geocoded["results"][0]["geometry"]["location"]["lat"], "lng": geocoded["results"][0]["geometry"]["location"]["lng"]}
        else: 
          facility_lookup[row[0]] = {"lat": "", "lng": ""}

        writer.writerow((row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], facility_lookup[row[0]]["lat"], facility_lookup[row[0]]["lng"]))