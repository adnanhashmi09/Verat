const gun = require('gun');

const details1 = {
    name: 'hi',
    date: 'hello',
    place: 'random'
};
const details2 = {
    name: 'hiswwd',
    date: 'helladDSo',
    place: 'randADDSom'
};

const db = gun();

db.get('info').get('info2').put({ details1 }, (ack) => {
    console.log(ack);
    db.get('info').get('info2').put({ details2 }, (ack2) => {
        console.log(ack2);
        db.get('info').get('info2').once((data) => {
            console.log(data.details1);
            db.get('info').put(data.details1['#'], (ackn) => {
                console.log(ackn);
            });
        });
    });
});
