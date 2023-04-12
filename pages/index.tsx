import { CommandLineIcon } from "components/icons/CommandLineIcon"

import { Inter } from "@next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <div className="text-center max-w-4xl m-auto text-gray-900 dark:text-gray-100">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl"
      >
        Cogito Protocol
      </h1>

      <p
        style={inter.style}
        className="mb-6 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
      >
        
        Creating decentralized and AI-driven stable asset that achieves smooth price behavior via peg to non-financial indices
      </p>

    
      <div style={inter.style} className="my-4 text-left">
      Cogito Protocol offers a <span>stablecoin-as-a-service</span> framework to create digital assets with low volatility called  <span>tracercoins</span>such that they act as complements to existing crypto stablecoin landscapes. The tracercoins maintain their stability not by seeking explicit correlation to one or more specific fiat currencies or commodities, but instead via soft-pegging to non-financial indices that represent progress along various developmental fronts, e.g. environmental progress, technological progress etc. The indices are constructed from a large series of macro data, which are strongly resistant to manipulation, fluctuate moderately, and reflect the genuine progress of humanity. Since manipulating the value of these indicators would require Herculean resources and efforts, these tracercoins can provide fair and independent measures of value, which in a fundamental sense are more effective than any available alternatives. 
      </div>

    
    </div>
  )
}
