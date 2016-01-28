'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const Config          = require( './Config' );


class ConfigProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'config', function *() {

            let config = yield this.make( Config );

            yield config.load();

            return config;

        } );

    }

}


module.exports = ConfigProvider;
