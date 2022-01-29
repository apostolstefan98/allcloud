import { LightningElement, track , api, wire } from 'lwc';
import retrieveWeather from "@salesforce/apex/WeatherController.retrieveWeather";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled }  from 'lightning/empApi';
const FIELDS  = ['Account.Id','Account.BillingCity'];

export default class AccountWeather extends LightningElement {
    @api recordId;
    @track result = [];
    account;
    lastAddress;

    //Platform event subscription
    subscription = {};
    @api channelName = '/event/On_Account_Address_Update__e';

    async connectedCallback(){
        this.retrieveWeather();
        this.handleSubscribe();
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

    handleSubscribe() {
        const thisReference = this;
        const messageCallback = function(response) {

            const evt = new ShowToastEvent({
                title: 'Address changed by platform event!!',
                variant: 'success',
            });

            thisReference.dispatchEvent(evt);
            thisReference.retrieveWeather();
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }


    retrieveWeather(){
        const evt = new ShowToastEvent({
            title: 'Retrieve',
            variant: 'success',
        });
        retrieveWeather({accId: this.recordId}).then(response=>{
            this.result = JSON.parse(response);
            console.log(result);
        }).catch(error=>{
            console.error(error);
        })
    }
    
}
