'use strict';


class Mail {

    static get services() {

        return [ 'Ioc' ];

    }

    constructor( services ) {

        Object.assign( this, services );

    }
}


module.exports = Mail;
