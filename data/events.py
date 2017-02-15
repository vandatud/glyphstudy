import json
import gpxpy.geo
from pprint import pprint
from datetime import datetime, date, time
import csv
import sys
import locale

with open('events.json', encoding="utf8") as data_file:    
    data = json.load(data_file)
	
# init dresden lat and long
dresdenLat = 51.051957
dresdenLong = 13.741596

# init earliest date -1 day
startTime = datetime(2011, 2, 4, 13, 30)

# init variables
timedif = datetime.now()
locDifference = -1
minTimeDif = 1000
maxTimeDif = 0
minPop = 1000
maxPop = 0
minPreis = 1000
maxPreis = 0
minEntfernung = 1000
maxEntfernung = 0
countOfCategories = {}
einschlussKategorien = {"arts/entertainment/nightlife", "musician/band", "sports/recreation/activities", "tours/sightseeing", "travel/leisure", "education", "health/beauty", "pet services"}

# csv header and preferences
csv.register_dialect('escaped', escapechar='\\', doublequote=False, quoting=csv.QUOTE_NONNUMERIC, lineterminator='\n')
print("id, days til event, music estimate, entrance fee, kilometres from dresden centre, category name, popularity, title")
f = open("cleaned.csv", 'wt', encoding='utf-8')
try:
	writer = csv.writer(f, dialect='escaped')
	writer.writerow(("Id","Title","Price","Distance","Time","EstimationMusic","Popularity","Category"))
	# for every item in json
	for val in data["hits"]:
		# var to save if line has missing items
		hasLineAllValues = True
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
			hasLineAllValues = False
			print(0, end=",")
			
		# print entrance free or first item of entranceFees or  0
		preis = 0
		if 'manualResult' in val["_source"] and 'entranceFee' in val["_source"]["manualResult"] and val["_source"]["manualResult"]["entranceFee"] != "":
			print(val["_source"]["manualResult"]["entranceFee"], end=",")
			preis  = val["_source"]["manualResult"]["entranceFee"]
		else:
			if 'foundEventEntranceFees' in val["_source"] and val["_source"]["foundEventEntranceFees"][0]["item"] != "":
				print(val["_source"]["foundEventEntranceFees"][0]["item"], end=",")
				preis  = val["_source"]["foundEventEntranceFees"][0]["item"]
			else:
				hasLineAllValues = False
				print(0, end=",")
				
		# print distance from dresden in kilometres either from Gema location or manual inserted location
		locDifference = -1
		if ('firstGemaNutzungsort' in val["_source"]) and ('address' in val["_source"]["firstGemaNutzungsort"]):
				locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["firstGemaNutzungsort"]["address"]["coordinate"]["lat"], val["_source"]["firstGemaNutzungsort"]["address"]["coordinate"]["lon"])
				locDifference = locDifference/1000
		else:
			if ('manualResult' in val["_source"]) and ('location' in val["_source"]["manualResult"]):
				locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["manualResult"]["location"]["address"]["coordinate"]["lat"], val["_source"]["manualResult"]["location"]["address"]["coordinate"]["lon"])
				locDifference = locDifference/1000
				
			else:
				if ('eventDataEs' in val["_source"]) and ('eventData' in val["_source"]["eventDataEs"]) and ('organizer' in val["_source"]["eventDataEs"]["eventData"]) and ('location' in val["_source"]["eventDataEs"]["eventData"]["organizer"]):
					locDifference = gpxpy.geo.haversine_distance(dresdenLat, dresdenLong, val["_source"]["eventDataEs"]["eventData"]["organizer"]["location"]["coordinate"]["lat"], val["_source"]["eventDataEs"]["eventData"]["organizer"]["location"]["coordinate"]["lon"])
					locDifference = locDifference/1000
		print(locDifference, end=",")
		entfernung = locDifference
			
		# print category 
		ortskategorie = "none"
		if ('eventDataEs' in val["_source"]) and ('eventData' in val["_source"]["eventDataEs"]) and ('organizer' in val["_source"]["eventDataEs"]["eventData"]) and ('category' in val["_source"]["eventDataEs"]["eventData"]["organizer"]):
			print(val["_source"]["eventDataEs"]["eventData"]["organizer"]["category"], end=",")
			ortskategorie = val["_source"]["eventDataEs"]["eventData"]["organizer"]["category"].lower()
			if ortskategorie in einschlussKategorien:
				if ortskategorie == "travel/leisure":
					ortskategorie = "tours/sightseeing"
				if ortskategorie == "pet services":
					ortskategorie = "health/beauty"
			else:
				hasLineAllValues = False
				print("none", end=",")
		else: 
			hasLineAllValues = False
			print("none", end=",")
		
		popularitaet = 0
		# print popularity GemaScore
		if ('firstGemaNutzungsort' in val["_source"]) and ('statistic' in val["_source"]["firstGemaNutzungsort"]) and ('countGemaNutzungsfaelle' in val["_source"]["firstGemaNutzungsort"]["statistic"]):
			print(val["_source"]["firstGemaNutzungsort"]["statistic"]["countGemaNutzungsfaelle"], end=",")
			popularitaet = val["_source"]["firstGemaNutzungsort"]["statistic"]["countGemaNutzungsfaelle"]

		else: 
			hasLineAllValues = False
			print("0", end=",")
			
		# print title or unknown
		titel = "unbekannt"
		if 'foundEventNamesAsString' in val["_source"]:
			print(val["_source"]["foundEventNamesAsString"])
			titel = val["_source"]["foundEventNamesAsString"]
		else:
			hasLineAllValues = False
			print("unknown")
		
		if (hasLineAllValues):
			if ortskategorie.lower() in countOfCategories:
				countOfCategories[ortskategorie.lower()] +=1
			else:
				countOfCategories[ortskategorie.lower()] = 1
			if popularitaet < minPop:
				minPop = popularitaet
			if popularitaet > maxPop:
				maxPop = popularitaet
			if entfernung < minEntfernung and entfernung != -1:
				minEntfernung = entfernung
			if entfernung > maxEntfernung:
				maxEntfernung = entfernung
			if isinstance(preis,str):
				preis = preis.replace(",", ".")
			if isinstance(preis,str) and preis == ".":
				preis = 0
			if isinstance(preis,str) and preis == "-":
				preis = 0
			if float(preis) < minPreis:
				minPreis = float(preis)
			if float(preis) > maxPreis:
				maxPreis = float(preis)
			if frist < minTimeDif:
				minTimeDif = frist
			if frist > maxTimeDif:
				maxTimeDif = frist
			writer.writerow((id, titel, (float(preis)/40)*10, ((entfernung-13.144975455023468)/539.4533798171345)*10, ((frist-49)/1678)*10, musikwahrscheinlichkeit/100, (popularitaet/1924)*10, ortskategorie.lower()))
			
finally:
    f.close()			
	## print for test
pprint(data["hits"][0])
print("minTime: ", minTimeDif)
print("maxTime: ", maxTimeDif)
print("minPop: ", minPop)
print("maxPop: ", maxPop)
print("minEntfernung: ", minEntfernung)
print("maxEntfernung: ", maxEntfernung)
print("minPreis: ", minPreis)
print("maxPreis: ", maxPreis)

for word, times in countOfCategories.items():
    print(word, ",", times)