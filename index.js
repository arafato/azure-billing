'use strict';

const rp = require('request-promise');

const clientId = `<your service principal ID`,
    secret = `<your service principal secret>`,
    tenantId = `<your tenant id`,
    subId = `<your subscription id`;

function acquireAccessTokenBySPN(tenantId, clientId, pwd) {
    let payload = `resource=https://management.core.windows.net/&client_id=${clientId}&grant_type=client_credentials&client_secret=${pwd}`;
    let adress = `https://login.windows.net/${tenantId}/oauth2/token`;

    let options = {
        method: 'POST',
        uri: adress,
        body: payload,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        json: true
    };

    return rp(options)
        .then(function (parsedBody) {
            return parsedBody.access_token;
        });
}

function getConsumptionData(subId, token) {
    const adress = `https://management.azure.com/subscriptions/${subId}/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview&reportedStartTime=2017-11-23T00%3a00%3a00%2b00%3a00&reportedEndTime=2017-11-24T12%3a00%3a00%2b00%3a00&aggregationGranularity=Hourly&showDetails=true`;
    const options = {
        method: 'GET',
        uri: adress,
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + token },
        json: true
    };
    return rp(options)
        .then((data) => {
            return data;
        });
}

function getMetadata(subId, token) {
    const adress = `https://management.azure.com/subscriptions/${subId}/providers/Microsoft.Commerce/RateCard?api-version=2015-06-01-preview&$filter=OfferDurableId eq 'MS-AZR-0003p' and Currency eq 'USD' and Locale eq 'en-US' and RegionInfo eq 'US'`;
    const options = {
        method: 'GET',
        uri: adress,
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + token },
        json: true
    };
    return rp(options)
        .then((data) => {
            return data;
        });
}

acquireAccessTokenBySPN(tenantId, clientId, secret)
    .then((token) => {
        return getConsumptionData(subId, token)
        // return getMetadata(subId, token);
    })
    .then((data) => {
        console.log(JSON.stringify(data, null, 2));
    });

