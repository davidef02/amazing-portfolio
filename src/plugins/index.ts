import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { getServerSideURL } from '@/utilities/getURL'

// Poiché abbiamo rimosso le collezioni di default, usiamo tipi generici per ora
const generateTitle: GenerateTitle<any> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Portfolio` : 'Portfolio'
}

const generateURL: GenerateURL<any> = ({ doc }) => {
  const url = getServerSideURL()
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  // redirectsPlugin rimosso temporaneamente per evitare crash di compilazione.
  // Puoi riattivarlo quando avrai creato la tua collezione 'Projects' aggiungendolo qui:
  // redirectsPlugin({ collections: ['projects'] }),
  
  seoPlugin({
    generateTitle,
    generateURL,
  }),
]
