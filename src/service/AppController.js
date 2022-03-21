
const createConfig = async (transaction) => { // INTL LOCL
    const neededSpec = {locale:"*", entity:"*", property:"*"};
    if(transaction.currency != "NGN") return false
    neededSpec.locale = transaction.CurrencyCountry == transaction.PaymentEntity.Country ? "LOCL" : "INTL";
    neededSpec.entity = transaction.PaymentEntity.Type
    neededSpec.property = [transaction.paymentEntity.ID, transaction.paymentEntity.Brand, transaction.paymentEntity.Issuer, transaction.paymentEntity.Number, transaction.paymentEntity.SixID]
}

const pickOptimalSec = async (configCreated)=>{
    // lists of configs match with specficity

    return "config id"
}



module.exports = {
    /** Sample Data generated 
     * [{id:"LNPY1221" currency:"NGN" , locale:"*", type:"*" , property:"*" , fee:{flat:1, perc:2.3} }]
     * 
     *  */ 
    processFeeConfigurations: async (feeConfigurationSpec)=>{
        let listOfSpec = feeConfigurationSpec.split("\n");
        let finalConfig = listOfSpec.map( specConfig => ({
                id: specConfig.split(":")[0].split(" ")[0],
                currency: specConfig.split(":")[0].split(" ")[1],
                locale: specConfig.split(":")[0].split(" ")[2],
                type: specConfig.split(":")[0].split(" ")[3].split("(")[0],
                property: specConfig.split(":")[0].split(" ")[3].split("(")[1].split(")")[0],
                fee: (
                    specConfig.split(":")[1].split(" ")[2] == "FLAT" ? {
                        "flat": specConfig.split(":")[1].split(" ")[3]
                    } :
                    specConfig.split(":")[1].split(" ")[2] == "PERC" ?
                    {
                        "perc": specConfig.split(":")[1].split(" ")[3]
                    } :
                    {
                        "flat": specConfig.split(":")[1].split(" ")[3].split(":")[0],
                        "perc": specConfig.split(":")[2]
                    }
                )
        }))
        let specMatcher = {}
        for (const iterator of finalConfig) {
            specMatcher[`${iterator.locale}/${iterator.type}/${iterator.property}`] = iterator.id
        }
        return {"finalConfig":finalConfig , "specMatcher":specMatcher}
    },

    computeFeeConfig: async (transaction) => { // INTL LOCL
        const neededSpec = {locale:"*", type:"*", property:"*"};
        if(transaction.Currency != "NGN") return false
        neededSpec.locale = transaction.CurrencyCountry == transaction.PaymentEntity.Country ? "LOCL" : "INTL";
        neededSpec.type = transaction.PaymentEntity.Type
        neededSpec.property = [transaction.PaymentEntity.ID, transaction.PaymentEntity.Brand, transaction.PaymentEntity.Issuer, transaction.PaymentEntity.Number, transaction.PaymentEntity.SixID]
        return neededSpec;
    },

    computeFee: async (feeSpec, customerIsFeeBearer, amount)=>{
        const flatFee = feeSpec.fee.hasOwnProperty('flat') ? feeSpec.fee.flat : Number(0);
        const perc = feeSpec.fee.hasOwnProperty('perc') ? (Number(feeSpec.fee.perc) * Number(amount)) / 100 : Number(0)
        const appliedFee = Number(flatFee) + Number(perc)
        if(customerIsFeeBearer) {
            return {
                "AppliedFeeID":feeSpec.id,
                "AppliedFeeValue":appliedFee,
                "ChargeAmount": Number(amount) + appliedFee,
                "SettlementAmount":Number(amount)
            }
        }else{
            return {
                "AppliedFeeID":feeSpec.id,
                "AppliedFeeValue":appliedFee,
                "ChargeAmount": Number(amount),
                "SettlementAmount":Number(amount) - appliedFee
            }
        }
    }
    
}
