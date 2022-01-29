public with sharing class WeatherController{
    @AuraEnabled
    public static Object retrieveWeather(Id accId){
        Account a = [SELECT Name , BillingLatitude , BillingLongitude , BillingCity FROM Account WHERE Id = :accId];
        String weatherDetail = retrieveWeather(a.BillingLatitude, a.BillingLongitude);
        if(!String.isBlank(weatherDetail)){
            WeatherResult weatherResult = new WeatherResult();
            weatherResult.description = weatherDetail;
            weatherResult.town = a.BillingCity;
	        a.Current_Weather__c = weatherDetail;
            upsert a;
            return JSON.serialize(weatherResult);
        }
		return null;
    }
    
   	public static String retrieveWeather(Decimal latitude, Decimal longitude){
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint('https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&appid=ab0f90ea4b792fcd6cbd51c68ec4f199');
        httpRequest.setMethod('GET');

        Map<String, Object> weatherJson = new Map<String, Object>();
        String strResponse = null;
        JSON2Apex ja = new JSON2Apex();

        try{
            Http http = new Http();
            HttpResponse httpResponse = http.send(httpRequest);
            System.debug('Stefan');
            System.debug(httpResponse.getBody());
            if(httpResponse.getStatusCode() == 200){
                strResponse = httpResponse.getBody();
            } else {
                throw new CalloutException(httpResponse.getBody());
            }
        } catch(Exception ex){
            throw ex;
        }

        if(!String.isBlank(strResponse)){
            ja = JSON2Apex.parse(strResponse);
            return ja.current.weather[0].description.capitalize();
        }
		return null;
    }

    
    public class WeatherResult{
    	public String description;
		public String town;
	}
}
