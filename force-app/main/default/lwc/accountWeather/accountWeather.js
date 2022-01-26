import { LightningElement, track , api, wire } from 'lwc';
import retrieveWeather from "@salesforce/apex/WeatherController.retrieveWeather";

export default class AccountWeather extends LightningElement {
    @api recordId;
    @track result = [];

    async connectedCallback(){
        this.retrieveWeather();
    }

    retrieveWeather(){
        retrieveWeather({accId: this.recordId}).then(response=>{
            console.log('Stefan');
            this.result = JSON.parse(response);
            console.log(result);
        }).catch(error=>{
            console.error(error);
        })
    }
    
}