global class WeatherBatchClass implements Database.Batchable<sobject>, Database.AllowsCallouts {
   
    global Database.QueryLocator start(Database.BatchableContext bc){
       
        String query = 'SELECT Id, Name, BillingLongitude, BillingLatitude FROM Account';
        return Database.getQueryLocator(query);
    }
       
    global void execute(Database.BatchableContext bc, List<account> scope) {
        for(Account a : scope) {
            try {
            a.Current_Weather__c = WeatherController.retrieveWeather(a.BillingLatitude, a.BillingLongitude);
            } catch(CalloutException e){
                System.debug('Callout exception'+ e.getMessage());
            } finally {
            }
        }
        update scope;
    } 
       
    global void finish(Database.BatchableContext bc) {
       
    }
}