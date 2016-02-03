'use strict';

const Promise = require( 'bluebird' );
const Loader  = require( './Loader' );


class App {

    static get services() {

        return [ 'env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            config: {}
        } );

        return Promise
            .bind( this, this )
            .tap( Loader.loadConfig );

    }

}


module.exports = App;
