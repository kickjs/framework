'use strict';

const _       = require( 'lodash' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


class Config {

    static get services() {

        return [ 'env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            config: {}
        } );

        return this.load();

    }

    get( ...args ) {

        return _.get( this.config, ...args );

    }

    set( ...args ) {

        return _.set( this.config, ...args );

    }

    has( ...args ) {

        return _.has( this.config, ...args );

    }

    load() {

        let mode     = _.get( this.env, 'mode' );
        let path     = _.get( this.env, 'paths.app' );
        let patterns = [
            '*/config/defaults.js',
            '*/config/defaults/**.js'
        ];

        if ( mode )
        {
            patterns.push( '*/config/' + mode + '.js' );
            patterns.push( '*/config/' + mode + '/**.js' );
        }

        return Promise.all( patterns )
            .mapSeries( pattern => Glob( pattern, { cwd: path, nomount: true } ) )
            .reduce( ( files, file ) => files.concat( file ), [] )
            .each( file => {

                let name = _( file )
                    .chain()
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .split( /[\\\/]/g )
                    .tap( nodes => {
                        nodes.splice( 1, 2 );
                    } )
                    .join( '.' );

                let value = require( path + '/' + file );

                if ( !_.isPlainObject( value ) )
                {
                    value = {};
                }

                merge( this.config, _.set( {}, name, value ) );

            } )
            .return( this );

    }

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}


module.exports = Config;
