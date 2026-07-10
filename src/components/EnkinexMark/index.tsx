import React from 'react';

/**
 * Enkinex symbol (the approved mark from the brand logo system).
 * Geometry: neuron/synapse triangle, three cuneiform wedges, three streams.
 * `streams` colors the central streams + neuron body, `wedges` the three
 * corner wedges. Pass the same value to both for the mono/white version.
 * `wedgeLeft`/`wedgeRight`/`wedgeTop` override individual wedges for the
 * expressive "Trio · Full" variation of the logo system.
 */
export interface EnkinexMarkProps {
  streams?: string;
  wedges?: string;
  wedgeLeft?: string;
  wedgeRight?: string;
  wedgeTop?: string;
  size?: number;
  className?: string;
}

const BODY =
  'M -3.9999551,58.583614 V 37.999857 36.723966 a 70,70 0 0 0 -34.9343019,-60.583899 70,70 0 0 0 -0.06563,-0.03772 l -1.105359,-0.638204 -17.825785,-10.291878 a 14,14 0 0 0 1.11156,-1.18029 14,14 0 0 0 5.17e-4,-5.16e-4 14,14 0 0 0 2.421557,-4.19406 14,14 0 0 0 0.466122,-1.553393 h 5.16e-4 l 17.825786,10.291878 1.104842,0.638204 a 70,70 0 0 0 0.0031,0.0015 70,70 0 0 0 69.993661,0 l 1.108459,-0.639754 17.825786,-10.291878 a 14,14 0 0 0 4.000272,6.928259 l -17.825785,10.291878 -1.105359,0.638204 a 70,70 0 0 0 -0.05374,0.03101 70,70 0 0 0 -34.9461877,60.590617 v 1.275891 20.583757 a 14,14 0 0 0 -8.0000284,0 z M -1.9927474e-4,8.9571853 A 70,70 0 0 1 12.801087,-13.390805 a 70,70 0 0 1 -25.602055,0 70,70 0 0 1 12.80076872526,22.3479903 z';

const WEDGE_LEFT =
  'M -18.351113,2.2679492 H -40.259818 A 16,16 0 0 1 -54.1162,-5.73205 L -65.070577,-24.705546 -74.478184,-41 A 8,8 0 0 1 -67.55,-53 h 18.815233 21.908705 a 16,16 0 0 1 13.856362,8 L -2.0153025,-26.026505 -2,-26 a 26.5359,26.5359 0 0 1 -8.4101,-0.7104 L -16.350853,-37 A 16,16 0 0 0 -30.2073,-45 H -42.088675 -53.549981 A 14,14 0 0 1 -60.55,-32.8756 l 5.730672,9.925739 5.940708,10.289607 a 16,16 0 0 0 13.85642,8.000004 l 11.881401,-4e-6 A 26.5359,26.5359 0 0 1 -18.3205,2.26795 l -0.03061,-8e-7';

const WEDGE_RIGHT =
  'M 18.320508,2.2679492 A 26.5359,26.5359 0 0 1 23.1408,-4.66025 l 11.881414,-4e-6 A 16,16 0 0 0 48.8786,-12.6603 l 5.940728,-10.289561 5.730653,-9.925783 A 14,14 0 0 1 53.55,-45 H 42.088675 30.207259 A 16,16 0 0 0 16.3509,-37 l -5.940755,10.289607 A 26.5359,26.5359 0 0 1 2,-26 L 2.015303,-26.02651 12.969655,-45 A 16,16 0 0 1 26.8261,-53 H 48.734767 67.549981 A 8,8 0 0 1 74.4782,-41 L 65.070577,-24.705546 54.116225,-5.7320508 A 16,16 0 0 1 40.2598,2.26795 l -21.908687,-8e-7 h -0.03061';

const WEDGE_TOP =
  'M 6.9282031,76 A 8,8 0 0 1 -6.9282,76 m -3.2e-6,0 L -16.335811,59.705546 -27.290163,40.732051 A 16,16 0 0 1 -27.2902,24.7321 l 10.954389,-18.9735445 0.0153,-0.026505 A 26.5359,26.5359 0 0 1 -12.7307,13.3706 l -5.940661,10.289654 A 16,16 0 0 0 -18.6714,39.6603 L -12.730653,49.949861 -7,59.875644 A 14,14 0 0 1 7,59.8756 l 5.730653,-9.925739 5.940708,-10.289607 A 16,16 0 0 0 18.6714,23.6603 L 12.730653,13.370647 A 26.5359,26.5359 0 0 1 16.3205,5.73205 L 27.290163,24.732051 A 16,16 0 0 1 27.2902,40.7321 L 16.320508,59.732051 6.9282032,76';

export default function EnkinexMark({
  streams = '#2bc4b4',
  wedges = '#ecf3f1',
  wedgeLeft = wedges,
  wedgeRight = wedges,
  wedgeTop = wedges,
  size = 24,
  className,
}: EnkinexMarkProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 38 34"
      width={size}
      height={(size * 34) / 38}
      className={className}
      aria-hidden="true"
      style={{flex: 'none', display: 'block'}}>
      <g
        transform="matrix(0.22498111,0,0,-0.22498111,19.038788,20.036629)"
        fillRule="evenodd">
        <path fill={streams} d={BODY} />
        <path fill={wedgeLeft} d={WEDGE_LEFT} />
        <path fill={wedgeRight} d={WEDGE_RIGHT} />
        <path fill={wedgeTop} d={WEDGE_TOP} />
      </g>
    </svg>
  );
}
