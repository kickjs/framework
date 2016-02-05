'use strict';

const Promise = require( 'bluebird' );
const Loader  = require( './Loader' );


class App {

    static get services() {

        return [ 'Ioc', 'Env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            config: {},
            helpers: {},
            services: {},
            controllers: {}
        } );

        return Promise
            .bind( this, this )
            .tap( Loader.loadConfig )
            .tap( Loader.loadNamespaces )
            .tap( Loader.loadControllers );

    }

}


module.exports = App;
