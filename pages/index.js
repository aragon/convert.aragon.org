import React from 'react'
import Basics from '../components/Basics'
import BecomeAJuror from '../components/BecomeAJuror'
import Converter from '../components/converter/Converter'
import CourtGuides from '../components/CourtGuides'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Info from '../components/Info'
import Stats from '../components/Stats'
import Subscribe from '../components/Subscribe'

export default () => {
  return (
    <div>
      <Hero />
      <Stats />
      <Converter />
      <Features />
      <Info />
      <CourtGuides />
      <BecomeAJuror />
      <Basics />
      <Subscribe />
      <Footer />
    </div>
  )
}
