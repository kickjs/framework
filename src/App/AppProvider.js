'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const App             = require( './App' );


class ConfigProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'App', function () {

            return this.make( App );

        } );

    }

}


module.exports = ConfigProvider;
