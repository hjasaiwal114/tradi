import {Counter, Gauge,Histogram, register} from "prom-client"

export const metric = {
    messaageRecieved: new Counter({name: 'message_recieve_hore', help: 'total message recieved from pub/sub' }),
    messageDrropped: new Counter({name: 'engine_message_drop', help: 'total marlformed message drop', labelNames: ['reason']}),
    flushTotal: new Counter({name: 'engine_fush_total', help: 'buffer flush to the main price map'}),
    flushDuration: new Histogram({name:'engine_flush_duration', help: 'Duration of the flush operation'}),
    symbolCounts: new Gauge({name: 'engine_symbol_couts', help: 'current number of symbol in the price Map'}),
};

// expose the registory of metrix end point
export {register};
