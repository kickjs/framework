'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const Config          = require( './Config' );


class ConfigProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'config', function () {

            return this.make( Config );

        } );

    }

}


module.exports = ConfigProvider;
