'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const App             = require( '../App' );


class AppProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'app', function *() {

            return this.make( App );

        } );

    }

}


module.exports = AppProvider;
