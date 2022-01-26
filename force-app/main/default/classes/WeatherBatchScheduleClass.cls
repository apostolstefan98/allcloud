global class WeatherBatchScheduleClass implements Schedulable{
    global void execute(SchedulableContext sc) {
        Database.executeBatch(new WeatherBatchClass());
    }
}