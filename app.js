'use strict';

const _         = require( 'lodash' );
const Registrar = require( 'kick-ioc/Registrar' );


Registrar
    .constant( 'Env', {
        mode: 'development',
        paths: {
            app: __dirname + '/App'
        }
    } )
    .bind( 'Ioc', function () {
        return this;
    } )
    .register(
        require( './src/App/AppProvider' ),
        require( './src/Koa/KoaProvider' ),
        require( './src/Router/RouterProvider' ),
        require( './src/Server/ServerProvider' )
    )
    .resolve( function *() {

        let [ Server, App ] = yield [ this.use( 'Server' ), this.use( 'App' ) ];

        Server.start();

        console.log( 'server.start();' );

        console.log( App.config );
        console.log( App.controllers );

    } )
    .catch( function ( err ) {

        console.log( err );
        console.log( err.stack );

    } );
