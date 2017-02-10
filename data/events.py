import json
import gpxpy.geo
from pprint import pprint
from datetime import datetime, date, time
import csv
import sys

with open('events.json', encoding="utf8") as data_file:    
    data = json.load(data_file)


# init dresden lat and long
dresdenLat = 51.051957
dresdenLong = 13.741596

# init earliest date -1 day
startTime = datetime(2011, 2, 4, 13, 30);

# init variables
timedif = datetime.now()
locDifference = -1;

# csv header
print("id, days til event, music estimate, entrance fee, kilometres from dresden centre, category name, popularity, title")
f = open("out.csv", 'wt')
try:
	writer = csv.writer(f)
	writer.writerow(("Id","Title","Price","Distance","Time","EstimationMusic","Popularity","Category"))
	# for every item in json
	for val in data["hits"]:
		# print id 
		print(val["_id"], end=",")
		id = val["_id"]
		
		# calculate time difference in days and print it
		timedif = (datetime.strptime(val["_source"]["foundEventDates"][0]["item"].split('+')[0], '%Y-%m-%dT%H:%M:%S')-startTime)
		print(timedif.days, end=",")
		frist = timedif.days
		
		musikwahrscheinlichkeit = 0
		# print music estimation value or 0
		if 'estimationMusic' in val["_source"]:
			print(val["_source"]["estimationMusic"], end=",")
			musikwahrscheinlichkeit = val["_source"]["estimationMusic"]
		else:
			print(0, end=",")
			
		# print entrance free or first item of entranceFees or  0
		preis = 0
		if 'manualResult' in val["_source"]:
			print(val["_source"]["manualResult"]["entranceFee"] or 0, end=",")
			preis  = val["_source"]["manualResult"]["entranceFee"] or 0
		else:
			if 'foundEventEntranceFees' in val["_source"]:
				print(val["_source"]["foundEventEntranceFees"][0]["item"], end=",")
				preis  = val["_source"]["foundEventEntranceFees"][0]["item"]
			else:
				print(0, end=",")

		# print distance from dresden in kilometres either from Gema location or manual inserted location
		locDifference = -1;
		if ('firstGemaNutzungsort' in val["_source"]) and ('address' in val["_source"]["firstGemaNutzungsort"]):
				locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["firstGemaNutzungsort"]["address"]["coordinate"]["lat"], val["_source"]["firstGemaNutzungsort"]["address"]["coordinate"]["lon"])
				locDifference = locDifference/1000;
		else:
			if ('manualResult' in val["_source"]) and ('location' in val["_source"]["manualResult"]):
				locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["manualResult"]["location"]["address"]["coordinate"]["lat"], val["_source"]["manualResult"]["location"]["address"]["coordinate"]["lon"])
				locDifference = locDifference/1000;
			else:
				if ('eventDataEs' in val["_source"]) and ('eventData' in val["_source"]["eventDataEs"]) and ('organizer' in val["_source"]["eventDataEs"]["eventData"]) and ('location' in val["_source"]["eventDataEs"]["eventData"]["organizer"]):
					locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["eventDataEs"]["eventData"]["organizer"]["location"]["coordinate"]["lat"], val["_source"]["eventDataEs"]["eventData"]["organizer"]["location"]["coordinate"]["lon"])
					locDifference = locDifference/1000;
		print(locDifference, end=",")
		entfernung = locDifference
			
		# print category 
		ortskategorie = "none"
		if ('eventDataEs' in val["_source"]) and ('eventData' in val["_source"]["eventDataEs"]) and ('organizer' in val["_source"]["eventDataEs"]["eventData"]) and ('category' in val["_source"]["eventDataEs"]["eventData"]["organizer"]):
			print(val["_source"]["eventDataEs"]["eventData"]["organizer"]["category"], end=",")
			ortskategorie = val["_source"]["eventDataEs"]["eventData"]["organizer"]["category"]
		else: 
			print("none", end=",")
		
		popularitaet = 0
		# print popularity GemaScore
		if ('firstGemaNutzungsort' in val["_source"]) and ('statistic' in val["_source"]["firstGemaNutzungsort"]) and ('countGemaNutzungsfaelle' in val["_source"]["firstGemaNutzungsort"]["statistic"]):
			print(val["_source"]["firstGemaNutzungsort"]["statistic"]["countGemaNutzungsfaelle"], end=",")
			popularitaet = val["_source"]["firstGemaNutzungsort"]["statistic"]["countGemaNutzungsfaelle"]
		else: 
			print("0", end=",")
		
		# print title or unknown
		titel = "unbekannt"
		if 'foundEventNamesAsString' in val["_source"]:
			print(val["_source"]["foundEventNamesAsString"])
			titel = val["_source"]["foundEventNamesAsString"]
		else:
			print("unknown")
			
		writer.writerow((id, titel, preis, entfernung, frist, musikwahrscheinlichkeit, popularitaet, ortskategorie))
finally:
    f.close()			
	## print for test		
pprint(data["hits"][0])
