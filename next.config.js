/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', //docker compatibility
  compiler:{
    styledComponents:{ 
    ssr:true,
    displayName:true 
    }
  }
}


module.exports = nextConfig
