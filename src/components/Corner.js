import React from 'react';
import PropTypes from 'prop-types';

const Corner = ({ corner, className, children }) => {
    const pos = derivePos(corner);

    return (
        <div
            className={className}
            style={{
                position: 'absolute',
                top: pos[0],
                left: pos[1],
                bottom: pos[2],
                right: pos[3],
                [pos[4].which]: pos[4].val,
            }}
        >
            {children}
        </div>
    )
}

Corner.propTypes = {
    corner: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
}

const derivePos = (corner) => {
    switch (corner) {
        case 'tl':
            return ['0' , '0', null, null, { which: 'borderBottomRightRadius', val: '15px' }];
        case 'bl':
            return [null , '0', '0', null, { which: 'borderTopRightRadius', val: '15px' }];
        case 'tr':
            return ['0' , null, null, '0', { which: 'borderBottomLeftRadius', val: '15px' }];
        case 'br':
            return [null , null, '0', '0', { which: 'borderBottomLeftRadius', val: '15px' }];
    }
}

export default Corner;