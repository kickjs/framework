'use strict';


class Product {

    static get services() {

        return [ 'Ioc', 'App/Services/Mail' ];

    }

    constructor( services ) {

        Object.assign( this, services );

    }
}


module.exports = Product;
