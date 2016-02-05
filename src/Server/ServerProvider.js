'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const Server          = require( './Server' );


class ServerProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'Server', function () {

            return this.make( Server );

        } );

    }

}


module.exports = ServerProvider;
