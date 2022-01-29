import { LightningElement, track , api, wire } from 'lwc';
import retrieveWeather from "@salesforce/apex/WeatherController.retrieveWeather";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS  = ['Account.Id','Account.BillingCity'];

export default class AccountWeather extends LightningElement {
    @api recordId;
    @track result = [];
    account;
    lastAddress;

    async connectedCallback(){
        this.retrieveWeather();
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
           console.log('error occured');
        } else if (data) {
            this.account = data;
            console.log('Stefan');
            console.log(this.account.fields.BillingCity.value);
            
            let address = this.account.fields.BillingCity.value;
            if(!this.lastAddress) {
                this.lastAddress = this.account.fields.BillingCity.value;
            }
            if (address != this.lastAddress) {
                this.showNotification();                
                this.retrieveWeather();
            }
            
        }
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Account Billing Address Modified, going to trigger retrieveWeather',
            variant: 'success'
        });
        this.dispatchEvent(evt);
    }


    retrieveWeather(){
        retrieveWeather({accId: this.recordId}).then(response=>{
            this.result = JSON.parse(response);
            console.log(result);
        }).catch(error=>{
            console.error(error);
        })
    }
    
}
