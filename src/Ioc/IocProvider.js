'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );


class IocProvider extends ServiceProvider {

    register( ioc ) {

        ioc.bind( 'Ioc', function () {

            return this;

        } );

    }

}


module.exports = IocProvider;
