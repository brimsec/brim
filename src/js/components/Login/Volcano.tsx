import React from "react"

export default function Volcano() {
  return (
    <svg
      width="98px"
      height="74px"
      viewBox="0 0 98 74"
      version="1.1"
      className="brand-volcano"
    >
      <defs>
        <linearGradient
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="linearGradient-1"
        >
          <stop stopColor="#F49165" offset="0%" />
          <stop stopColor="#E65835" offset="100%" />
        </linearGradient>
        <path
          d="M35.7129351,5.30094285 C35.6120511,5.0342933 35.5616091,4.7211636 35.5616091,4.36155375 C35.5616091,4.0019439 35.6120511,3.6888142 35.7129351,3.42216464 C39.3413008,2.70315324 43.897605,2.3117776 49.9375788,2.3117776 C55.9775526,2.3117776 60.5386093,2.73623571 64.1622224,3.43389247 C64.1622224,3.43389247 64.3135484,3.8221532 64.3135484,4.36156086 C64.3135484,4.72116597 64.2631064,5.03038402 64.1622224,5.28921502 C60.5372341,5.98713654 55.9855489,6.44215359 49.9375788,6.44215359 C43.8896087,6.44215359 39.3512615,6.02192809 35.7129351,5.30094285 Z"
          id="path-2"
        />
      </defs>
      <g
        id="Login-Page"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Login-Page-Simple-Copy"
          transform="translate(-62.000000, -42.000000)"
        >
          <g id="Group" transform="translate(37.000000, 40.000000)">
            <g id="Logo-/-Medium" transform="translate(23.000000, 0.000000)">
              <path
                d="M3.16725054,69.1693163 C9.53915807,59.3139063 15.0629874,49.6144048 19.7387385,40.0708118 C24.7607268,29.8205199 29.0000078,19.3903747 32.4565814,8.78037619 L32.4565719,8.7803731 C32.9352949,7.31092662 34.4187883,6.41444475 35.94231,6.67392562 C39.9818473,7.36192544 44.2938429,7.70592535 48.8782968,7.70592535 C33.2436525,31.1030975 72.7211294,49.3900244 48.8782968,73.9768833 L5.78384598,73.9768833 C4.06300912,73.9768983 2.6679952,72.5818844 2.6679952,70.8610475 C2.6679952,70.2608206 2.8413612,69.6733684 3.16725054,69.1693163 Z"
                id="left-side"
                fill="#2F619C"
                fillRule="evenodd"
              />
              <path
                d="M50.9968607,7.70592535 C55.4910636,7.70592535 59.8481742,7.3495537 64.0681924,6.6368104 L64.0681921,6.63680904 C65.5381597,6.3885377 66.978039,7.21629012 67.5032003,8.61151371 C71.3822378,18.9171552 75.8385846,29.4035879 80.8722407,40.0708118 C85.528229,49.9376897 90.8486242,59.6498875 96.8334263,69.2074054 C97.7467059,70.6658862 97.3047363,72.5885785 95.8462571,73.5018606 C95.3505507,73.8122659 94.7774865,73.9768833 94.1926137,73.9768833 L50.9968607,73.9768833 C73.9610175,49.3900244 35.9383973,31.1030975 50.9968607,7.70592535 Z"
                id="right-side"
                fill="#3A79C2"
                fillRule="evenodd"
              />
              <mask id="mask-3" fill="white">
                <use xlinkHref="#path-2" />
              </mask>
              <use
                id="lava"
                fill="url(#linearGradient-1)"
                fillRule="evenodd"
                xlinkHref="#path-2"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
