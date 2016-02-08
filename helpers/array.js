'use strict';

const _ = require( 'lodash' );


export function combinate( ...array ) {

    let clone = array.slice();
    let first = clone.shift();

    if ( _.isUndefined( first ) )
    {
        return [];
    }

    if ( !_.isArray( first ) )
    {
        first = [ first ];
    }

    if ( !clone.length )
    {
        return first.map( function ( f ) {

            return [ f ];

        } );
    }

    let remain = combinate( ...clone );
    let rows   = [];

    first.forEach( function ( f ) {

        remain.forEach( function ( r ) {

            rows.push( [ f ].concat( r ) );

        } );

    } );

    return rows;

}
