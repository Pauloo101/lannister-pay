# Lannister-Pay
`Payment processing involves several components / services. One of such is determining the processing fee to charge per transaction. This assessment is about implementing an NGN (Nigerian Naira) fee processing service for a fictional Payment Processor (LannisterPay).`

LannisterPay uses a custom fee configuration spec (FCS) to describe applicable fees.
# run
`node main.js`
 

# Fee Configuration Spec (FCS)
The LannisterPay custom FCS defines (line by line) fee entries that can be applied to a given transaction. An example is shared below:

 -LNPY1221 NGN LOCL CREDIT-CARD(*) : APPLY PERC 1.4
 -LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8
 -LNPY1223 NGN INTL CREDIT-CARD(*) : APPLY PERC 5.8
 -LNPY1224 NGN LOCL USSD(MTN) : APPLY FLAT_PERC 20:0.5
 -LNPY1225 NGN LOCL USSD(*) : APPLY FLAT_PERC 20:0.5 

 
# Basic FCS (Single Line) Syntax
`{FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}`

# EndPoints
  ## /fee method(post)
    {
    "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
    }

  ## /compute-transaction-fee method(post)

  **Sample Payload**
 ` {
    "ID": 91203,
    "Amount": 5000,
    "Currency": "NGN",
    "CurrencyCountry": "NG",
    "Customer": {
        "ID": 2211232,
        "EmailAddress": "anonimized29900@anon.io",
        "FullName": "Abel Eden",
        "BearsFee": true
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "GTBANK",
        "Brand": "MASTERCARD",
        "Number": "530191******2903",
        "SixID": 530191,
        "Type": "CREDIT-CARD",
        "Country": "NG"
    }
}`
