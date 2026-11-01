import process from 'node:process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Royal Knot database with all 11 modules...');

  // 1. Users
  const hashedPassword = await bcrypt.hash('Royal@2026!', 10);

  const users = [
    { email: 'admin@royalknot.com', firstName: 'Ranveer', lastName: 'Singh Rathore', role: 'ROLE_ADMIN' as const },
    { email: 'planner@royalknot.com', firstName: 'Ishaani', lastName: 'Sharma', role: 'ROLE_PLANNER' as const },
    { email: 'client@royalknot.com', firstName: 'Aanya', lastName: 'Sharma', role: 'ROLE_CLIENT' as const },
    { email: 'vendor@royalknot.com', firstName: 'Raghavendra', lastName: 'Rao', role: 'ROLE_VENDOR' as const },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: hashedPassword,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        active: true,
      },
      create: {
        email: u.email,
        password: hashedPassword,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        active: true,
      },
    });
  }

  // 2. Wedding Packages
  const packages = [
    {
      name: 'Full-Service Wedding',
      description: 'Complete end-to-end luxury wedding planning, venue coordination, theme & decor, catering, photography, entertainment, vendor management and event-day execution.',
      basePrice: 2500000.0,
      inclusions: 'Complete Planning, Venue Coordination, Theme & Decor, 3-Day Catering Oversight, Photography & Cinema, Celebrity Entertainment, Master 3-Day Event-Day Coordination',
    },
    {
      name: 'Partial / Day-of Service',
      description: 'Assistance with selected planning activities, vendor coordination, run-of-show schedule management, wedding-day execution, and on-site hospitality coordination.',
      basePrice: 1000000.0,
      inclusions: 'Selected Vendor Coordination, 3-Day Event Schedule Management, Wedding-Day On-Site Direction, Run-of-Show Stage Execution',
    },
    {
      name: 'Full-Service Royal Luxury',
      description: 'End-to-end luxury management covering concept, design, venue curation, vendor procurement, production, logistics, live execution & guest relations.',
      basePrice: 2500000.0,
      inclusions: 'Dedicated Senior Director, 8 Planners Onsite, Bespoke Production, 25-Point Operational Checklist, Live Minute-by-Minute Run-sheet, Digital Portal Access',
    },
    {
      name: 'Partial Coordination Elegance',
      description: 'Designed for couples who have contracted their key venues but require professional curation, vendor coordination, and 3-day on-site ceremony execution.',
      basePrice: 1000000.0,
      inclusions: '3 Onsite Planners, Final 6-Week Vendor Takeover, Timeline Architecture, Rehearsal Direction, Day-of Vendor Arrival Control',
    },
  ];

  for (const pkg of packages) {
    await prisma.weddingPackage.upsert({
      where: { name: pkg.name },
      update: {
        description: pkg.description,
        basePrice: pkg.basePrice,
        inclusions: pkg.inclusions,
      },
      create: pkg,
    });
  }

  // 3. Consultation Enquiry (Idempotent upsert)
  const enquirySharma = await prisma.enquiry.upsert({
    where: { email: 'client@royalknot.com' },
    update: {
      coupleNames: 'Aanya Sharma & Arjun Mehta',
      phone: '+91 98201 54321',
      preferredWeddingDate: new Date('2026-11-20'),
      estimatedGuestCount: 400,
      weddingLocation: 'City Palace, Udaipur',
      preferredTheme: 'Royal Rajasthani Heritage & Gold',
      weddingType: 'Traditional Royal Indian',
      selectedPackage: 'Full-Service Royal Luxury',
      maximumBudget: 2500000.0,
      additionalRequirements: 'Bespoke Mewari royal procession, elephant welcome, live Shehnai, gourmet Awadhi & Rajasthani feast.',
      status: 'Consultation Scheduled',
      consultationScheduledDate: new Date('2026-11-05T14:30:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
    create: {
      coupleNames: 'Aanya Sharma & Arjun Mehta',
      email: 'client@royalknot.com',
      phone: '+91 98201 54321',
      preferredWeddingDate: new Date('2026-11-20'),
      estimatedGuestCount: 400,
      weddingLocation: 'City Palace, Udaipur',
      preferredTheme: 'Royal Rajasthani Heritage & Gold',
      weddingType: 'Traditional Royal Indian',
      selectedPackage: 'Full-Service Royal Luxury',
      maximumBudget: 2500000.0,
      additionalRequirements: 'Bespoke Mewari royal procession, elephant welcome, live Shehnai, gourmet Awadhi & Rajasthani feast.',
      status: 'Consultation Scheduled',
      consultationScheduledDate: new Date('2026-11-05T14:30:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
  });

  const enquiryReddy = await prisma.enquiry.upsert({
    where: { email: 'priya.reddy@gmail.com' },
    update: {
      coupleNames: 'Priya Reddy & Karthik Varma',
      phone: '+91 98490 12345',
      preferredWeddingDate: new Date('2026-12-18'),
      estimatedGuestCount: 350,
      weddingLocation: 'Umaid Bhawan Palace, Jodhpur',
      preferredTheme: 'Royal Rajputana & Coastal Spice',
      weddingType: 'Traditional Royal Indian',
      selectedPackage: 'Full-Service Royal Luxury',
      maximumBudget: 2800000.0,
      additionalRequirements: 'Heritage Sangeet gala, Nitrogen mocktail bar, royal thali dinner.',
      status: 'Confirmed',
      consultationScheduledDate: new Date('2026-10-10T11:00:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
    create: {
      coupleNames: 'Priya Reddy & Karthik Varma',
      email: 'priya.reddy@gmail.com',
      phone: '+91 98490 12345',
      preferredWeddingDate: new Date('2026-12-18'),
      estimatedGuestCount: 350,
      weddingLocation: 'Umaid Bhawan Palace, Jodhpur',
      preferredTheme: 'Royal Rajputana & Coastal Spice',
      weddingType: 'Traditional Royal Indian',
      selectedPackage: 'Full-Service Royal Luxury',
      maximumBudget: 2800000.0,
      additionalRequirements: 'Heritage Sangeet gala, Nitrogen mocktail bar, royal thali dinner.',
      status: 'Confirmed',
      consultationScheduledDate: new Date('2026-10-10T11:00:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
  });

  const enquirySingh = await prisma.enquiry.upsert({
    where: { email: 'diya.singh@gmail.com' },
    update: {
      coupleNames: 'Diya Singh & Vivaan Rajput',
      phone: '+91 97110 54321',
      preferredWeddingDate: new Date('2026-09-15'),
      estimatedGuestCount: 300,
      weddingLocation: 'Rambagh Palace, Jaipur',
      preferredTheme: 'Imperial Rajputana & Marigold',
      weddingType: 'Traditional Marwari Royal',
      selectedPackage: 'Full-Service Wedding',
      maximumBudget: 2200000.0,
      additionalRequirements: 'Pure desi ghee Marwari banquet, Dal Baati Churma, traditional royal hospitality.',
      status: 'Completed',
      consultationScheduledDate: new Date('2026-07-20T10:00:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
    create: {
      coupleNames: 'Diya Singh & Vivaan Rajput',
      email: 'diya.singh@gmail.com',
      phone: '+91 97110 54321',
      preferredWeddingDate: new Date('2026-09-15'),
      estimatedGuestCount: 300,
      weddingLocation: 'Rambagh Palace, Jaipur',
      preferredTheme: 'Imperial Rajputana & Marigold',
      weddingType: 'Traditional Marwari Royal',
      selectedPackage: 'Full-Service Wedding',
      maximumBudget: 2200000.0,
      additionalRequirements: 'Pure desi ghee Marwari banquet, Dal Baati Churma, traditional royal hospitality.',
      status: 'Completed',
      consultationScheduledDate: new Date('2026-07-20T10:00:00Z'),
      assignedPlannerEmail: 'planner@royalknot.com',
    },
  });

  // 4. Digital Agreement
  await prisma.agreement.upsert({
    where: { agreementNumber: 'AGR-2026-SHARMA-01' },
    update: {
      clientNames: 'Aanya Sharma & Arjun Mehta',
      packageName: 'Full-Service Royal Luxury',
      serviceScope: 'Complete 3-Day Wedding Planning at City Palace, Udaipur: Royal Rajasthani Mandap styling, 3-Day Catering coordination for 400 guests, Sangeet & Shehnai orchestration, 25+ automated task management, and live event control.',
    },
    create: {
      agreementNumber: 'AGR-2026-SHARMA-01',
      clientNames: 'Aanya Sharma & Arjun Mehta',
      clientEmail: 'client@royalknot.com',
      packageName: 'Full-Service Royal Luxury',
      serviceScope: 'Complete 3-Day Wedding Planning at City Palace, Udaipur: Royal Rajasthani Mandap styling, 3-Day Catering coordination for 400 guests, Sangeet & Shehnai orchestration, 25+ automated task management, and live event control.',
      agreedPrice: 2500000.0,
      termsAndConditions: '1. A 20% booking deposit (₹5,00,000) confirms reservation.\n2. Milestone 2 due 30 days prior to wedding date.\n3. The Royal Knot provides dedicated senior wedding planner and day-of control team.',
      status: 'Sent',
    },
  });

  // 5. Vendor Quotations (3 Distinct, Customized Service Offerings)
  const quotations = [
    {
      vendorName: 'Maharaja Catering & Events',
      vendorEmail: 'vendor@royalknot.com',
      serviceCategory: 'Catering',
      packageTitle: 'Royal Rajasthani Heritage Feast',
      description: 'Ultra-luxury royal palace banquet featuring 8 live thematic counters, antique royal copperware presentation, 45 uniformed stewards, and authentic 24-hr slow-simmered Awadhi & Mewari delicacies.',
      cuisineType: 'Royal Mewari, Awadhi & Mughlai Heritage',
      regionalSpecialization: 'Dum Pukht Biryani, Melt-in-mouth Galouti Kebabs, 24-hr Dal Bukhara, Shahi Tukda, Kesari Rasmalai',
      menuDetails: '7 Royal Welcome Drinks, 12 Starters (6 Veg, 6 Non-Veg), 14 Royal Main Courses, 8 Live Experiential Counters (Amritsari Kulcha, Chaat Galli, Live Sigri Grills), 6 Artisanal Desserts',
      vegetarianOptionsCount: 18,
      nonVegetarianOptionsCount: 12,
      pricePerPlate: 2200.0,
      guestCount: 400,
      additionalCharges: 120000.0,
      taxAmount: 50000.0,
      totalEstimatedPrice: 1050000.0,
      serviceInclusions: 'Full palace service cutlery & copperware, 45 uniformed stewards, mineral water hydration bars, continuous table service, dessert styling',
      exclusions: 'Alcoholic bar license and glassware permits',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Guaranteed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% booking deposit on agreement signing, 40% 15 days prior, 10% balance post-reception. Headcount locked at 400 guests minimum.',
    },
    {
      vendorName: 'Deccan Royal Kitchens',
      vendorEmail: 'inquiries@deccanroyalkitchens.com',
      serviceCategory: 'Catering',
      packageTitle: 'Nizami Grand Royal Dawat',
      description: 'Avant-garde culinary artistry blending progressive Indian flavours with royal Hyderabadi and Pan-Asian techniques. Features grazing tables, interactive nitrogen mocktails, and live robata skewers.',
      cuisineType: 'Contemporary Indo-Western & Nizami Royal Dawat',
      regionalSpecialization: 'Hyderabadi Dum Gosht Biryani, Truffle Infused Paneer Carpaccio, Gourmet Dim Sum Bar, Molecular Nitrogen Jalebi Caviar',
      menuDetails: '4 Molecular Welcome Elixirs, 14 Gourmet Grazing Starters (8 Veg, 6 Non-Veg), 12 Modern Fusion Mains, 4 Interactive Live Counters (Dim Sum Steamer, Robata Skewers, Bao Station), Liquid Nitrogen Dessert Bar',
      vegetarianOptionsCount: 16,
      nonVegetarianOptionsCount: 14,
      pricePerPlate: 1950.0,
      guestCount: 400,
      additionalCharges: 95000.0,
      taxAmount: 43750.0,
      totalEstimatedPrice: 918750.0,
      serviceInclusions: 'Minimalist matte ceramic tableware, acrylic display podiums, 40 trained hospitality stewards, ice sculpture centerpiece, custom printed menu cards',
      exclusions: 'Traditional charcoal tandoors (due to venue indoor restrictions)',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% deposit upon confirmation, 50% one week prior to event. 3-Phase 32A power supply required for nitrogen display counters.',
    },
    {
      vendorName: 'Annapurna Wedding Caterers',
      vendorEmail: 'quotes@annapurnacaterers.com',
      serviceCategory: 'Catering',
      packageTitle: 'South Indian Traditional Royal Sadya',
      description: 'Hearty, authentic traditional South Indian and Rajasthani feast focusing on culinary purity, pure ghee delicacies, and timeless banana-leaf & royal thali hospitality at accessible value.',
      cuisineType: 'Traditional South Indian Sadya & Pure Desi Ghee Classics',
      regionalSpecialization: 'Traditional Dal Baati Churma, Mysore Pak, Ada Pradhaman, Avial, Malabar Parotta, Jodhpuri Mirchi Vada',
      menuDetails: 'Traditional Welcome Kesar Badam Sharbat & Elaneer, 8 Appetizers (5 Veg, 3 Non-Veg), 10 Heritage Curries, 2 Live Traditional Counters (Live Appam & Tawa Parathas), Traditional Pure Desi Ghee Sweets',
      vegetarianOptionsCount: 20,
      nonVegetarianOptionsCount: 8,
      pricePerPlate: 1450.0,
      guestCount: 400,
      additionalCharges: 40000.0,
      taxAmount: 31000.0,
      totalEstimatedPrice: 651000.0,
      serviceInclusions: 'Stainless steel chafing dishes with brass trim, 30 attentive service staff, unlimited mineral water carafes, standard dining setup',
      exclusions: 'Imported exotic ingredients, molecular counters, outdoor canopy setups',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      pricingModel: 'PER_PLATE',
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '30% advance on booking, 70% 3 days prior to wedding. Pure vegetarian preparation protocol observed upon request.',
    },
    // Mandap and Stage Decoration
    {
      vendorName: 'Jaipur Heritage Decor & Florists',
      vendorEmail: 'contact@jaipurheritagedecor.com',
      serviceCategory: 'Mandap and Stage Decoration',
      pricingModel: 'FIXED',
      packageTitle: 'Royal Rajasthani Floral Mandap',
      description: 'Grand palace mandap with hand-carved Shekhawati teakwood pillars, 10,000 fresh royal marigolds, imported red roses, and a sacred brass havan kund.',
      cuisineType: 'Traditional Floral & Architecture',
      regionalSpecialization: 'Shekhawati Teakwood & Royal Marigolds',
      menuDetails: 'Complete mandap staging, royal floral aisle, brass chandeliers, havan seating for 12 priests',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 450000.0,
      guestCount: 1,
      additionalCharges: 35000.0,
      taxAmount: 24250.0,
      totalEstimatedPrice: 509250.0,
      serviceInclusions: 'Hand-carved pillars, 10,000 fresh marigolds and roses, sacred havan kund with fireproof carpets, VIP stage sofas',
      exclusions: 'Enclosed air conditioning setup',
      recommended: true,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '40% booking advance, 60% upon structural inspection on wedding eve.',
    },
    {
      vendorName: 'Dakshin Temple Scenography',
      vendorEmail: 'art@dakshintempledecor.com',
      serviceCategory: 'Mandap and Stage Decoration',
      pricingModel: 'FIXED',
      packageTitle: 'Traditional South Indian Temple Mandap',
      description: 'Intricately constructed temple Gopuram style mandap with live banana stems, fresh lotus ponds, fragrant mogra canopies, and heirloom brass lamps.',
      cuisineType: 'Vedic Temple Architecture',
      regionalSpecialization: 'Kerala Temple Carvings & Brass Vilakku',
      menuDetails: 'Temple Gopuram mandap, Vilakku oil lamps, mogra floral drapes, lotus urli entrance',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 380000.0,
      guestCount: 1,
      additionalCharges: 25000.0,
      taxAmount: 20250.0,
      totalEstimatedPrice: 425250.0,
      serviceInclusions: 'Gopuram wooden facade, banana trees, lotus pond installation, traditional oil brass lamps, fragrant tuberose strings',
      exclusions: 'Imported European flowers',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% on contract signing, 50% on event morning.',
    },
    {
      vendorName: 'Velvet & Flora Luxury Atelier',
      vendorEmail: 'concierge@velvetflora.com',
      serviceCategory: 'Mandap and Stage Decoration',
      pricingModel: 'FIXED',
      packageTitle: 'Contemporary Pastel Floral Dome',
      description: 'Ultra-modern ethereal floral dome crafted from blush peonies, white hydrangeas, mirrored crystal aisle, and 5,000 crystal drop pendants.',
      cuisineType: 'Contemporary Luxury Floral Art',
      regionalSpecialization: 'Imported Peonies & Crystal Glasswork',
      menuDetails: 'Spherical floral dome, mirror-top stage, crystal drop illumination, romantic haze integration',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 520000.0,
      guestCount: 1,
      additionalCharges: 45000.0,
      taxAmount: 28250.0,
      totalEstimatedPrice: 593250.0,
      serviceInclusions: 'Imported blush peonies, white hydrangeas, mirrored glass aisle, acrylic dome, 5,000 crystal drop pendants, warm amber uplighting',
      exclusions: 'Open flame havan inside dome (separate fire-safe platform provided)',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% booking deposit, 50% 1 week prior. Ambient lighting engineer included.',
    },
    // Candid Photography
    {
      vendorName: 'Hyderabad Royal Photography & Films',
      vendorEmail: 'studio@hyderabadroyalphotos.com',
      serviceCategory: 'Candid Photography',
      pricingModel: 'FIXED',
      packageTitle: 'Royal Candid & 4K Cinema Drone Masterpiece',
      description: 'Award-winning photojournalistic ritual capture with 3 candid specialists, 4K cinema drone for Baraat, 48-hour teaser video, and 2 luxury Italian leather albums.',
      cuisineType: 'Fine Art Wedding Photojournalism',
      regionalSpecialization: 'Palace Lighting & Royal Drone Cinematography',
      menuDetails: 'All rituals coverage, drone flyovers, couple editorial session, 2 luxury coffee-table albums',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 280000.0,
      guestCount: 1,
      additionalCharges: 20000.0,
      taxAmount: 15000.0,
      totalEstimatedPrice: 315000.0,
      serviceInclusions: '3 Senior candid photographers, 2 traditional shooters, 4K aerial drone, 48-hr teaser video, 2 handcrafted luxury albums',
      exclusions: 'Multi-day outstation stay beyond 3 days',
      recommended: true,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% upon confirmation, 40% on wedding day, 10% on album delivery.',
    },
    {
      vendorName: 'Mewar Wedding Visual Studio',
      vendorEmail: 'mewarvisuals@gmail.com',
      serviceCategory: 'Candid Photography',
      pricingModel: 'FIXED',
      packageTitle: 'Mewar Heritage Candid & Ritual Chronicle',
      description: 'Authentic documentary photography capturing emotional family moments, Muhurtham rituals, and timeless couple portraits in royal palace courtyards.',
      cuisineType: 'Heritage Wedding Documentary',
      regionalSpecialization: 'Mewari Palace Heritage Light',
      menuDetails: '3-day coverage, candid rituals focus, archival photo book, color-graded digital gallery',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 195000.0,
      guestCount: 1,
      additionalCharges: 15000.0,
      taxAmount: 10500.0,
      totalEstimatedPrice: 220500.0,
      serviceInclusions: '2 Candid photographers, 1 traditional videographer, 350-page flush-mount album, raw photo archive on high-speed SSD',
      exclusions: 'Drone aerial licenses for restricted airspace',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '40% advance, 60% on completion of digital delivery.',
    },
    // Mehendi Artists
    {
      vendorName: 'Meera Mehendi Studio Udaipur',
      vendorEmail: 'mehendi@meeramehendi.com',
      serviceCategory: 'Mehendi Artists',
      pricingModel: 'FIXED',
      packageTitle: 'Marwari Heritage Bridal Mehendi & Guest Team',
      description: 'Intricate 100% organic slow-brewed Sojat henna featuring personalized Radha-Krishna dulha-dulhan portraiture up to elbows and knees, with 4 assistant artists for 40 guests.',
      cuisineType: 'Artisanal Sojat Henna',
      regionalSpecialization: 'Marwari Dulha-Dulhan Figurines & Peacocks',
      menuDetails: 'Full bridal hands and feet, organic cloves-lemon aftercare, 4 guest artists',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 35000.0,
      guestCount: 1,
      additionalCharges: 5000.0,
      taxAmount: 2000.0,
      totalEstimatedPrice: 42000.0,
      serviceInclusions: 'Organic henna, bridal detailed portraits, 4 assistant artists for 40 guests, nilgiri sealant oils',
      exclusions: 'Glitter or chemical color applications',
      recommended: true,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% advance to block wedding date, 50% upon application.',
    },
    {
      vendorName: 'Priya Henna Artistry Jaipur',
      vendorEmail: 'priyahenna@jaipur.com',
      serviceCategory: 'Mehendi Artists',
      pricingModel: 'FIXED',
      packageTitle: 'Jharokha Architectural Henna Suite',
      description: 'Royal palace jharokha jaali work, personal couple skyline motifs, and delicate organic henna with Nilgiri oils, plus 3 guest artists for 25 guests.',
      cuisineType: 'Fine Architectural Henna',
      regionalSpecialization: 'Jharokha Jaali & Palace Skylines',
      menuDetails: 'Bridal elbow and calf application, jaali latticework, 3 assistant artists',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 28000.0,
      guestCount: 1,
      additionalCharges: 3000.0,
      taxAmount: 1550.0,
      totalEstimatedPrice: 32550.0,
      serviceInclusions: 'Jharokha architectural motifs, organic henna with eucalyptus oil, 3 guest artists for 25 guests',
      exclusions: 'Out-of-city travel beyond 50km',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% advance on booking, balance on event day.',
    },
    // Hindu Pandit / Purohit
    {
      vendorName: 'Sri Venkateswara Vedic Purohit Services',
      vendorEmail: 'vedicpurohit@royalknot.com',
      serviceCategory: 'Hindu Pandit / Purohit',
      pricingModel: 'FIXED',
      packageTitle: 'Vedic Muhurtham & Saptapadi Purohit Team',
      description: '3 Senior Rigvedic & Yajurvedic shastris conducting authentic Vivah Sanskar, sacred Agni homam, and 7 pheras with clear English and Hindi explanations for all guests.',
      cuisineType: 'Vedic Ritual Leadership',
      regionalSpecialization: 'Rigvedic & Yajurvedic Vivah Sanskar',
      menuDetails: 'Complete vivah sanskar rituals, homam, saptapadi, varmala mantras, wedding patrika',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 25000.0,
      guestCount: 1,
      additionalCharges: 5000.0,
      taxAmount: 1500.0,
      totalEstimatedPrice: 31500.0,
      serviceInclusions: '3 Senior Vedic scholars, authentic sanskrit chanting with bilingual explanations, complete homam conduction, ceremonial wedding certificate (Patrika)',
      exclusions: 'Pure cow ghee and puja samagri (itemized checklist provided in advance)',
      recommended: true,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '30% on booking date confirmation, 70% dakshina post-ceremony completion.',
    },
    {
      vendorName: 'Kashi Heritage Purohit Samiti',
      vendorEmail: 'kashipurohits@gmail.com',
      serviceCategory: 'Hindu Pandit / Purohit',
      pricingModel: 'FIXED',
      packageTitle: 'Kashi Traditional Vivah Sanskar',
      description: '2 Respected North Indian Vedic pandits leading auspicious Kanyadaan, Mangalsutra dharanam, and traditional Agni Pradakshina with traditional chanting.',
      cuisineType: 'North Indian Vedic Rituals',
      regionalSpecialization: 'Kashi Vedic Vivah Paddhati',
      menuDetails: 'Traditional Vivah Sanskar, Gauri Puja, Kanyadaan, Saptapadi',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 18000.0,
      guestCount: 1,
      additionalCharges: 2500.0,
      taxAmount: 1025.0,
      totalEstimatedPrice: 21525.0,
      serviceInclusions: '2 Vedic pandits, complete Vivah Sanskar rituals, Kanyadaan ceremony, havan samagri sourcing guidance',
      exclusions: 'Puja samagri materials',
      recommended: false,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: 'Booking advance ₹5,000, balance dakshina post-ceremony.',
    },
    // Live Music and Traditional Bands
    {
      vendorName: 'Udaipur Royal Shehnai Ensemble',
      vendorEmail: 'shehnai@udaipurroyals.com',
      serviceCategory: 'Live Music and Traditional Bands',
      pricingModel: 'FIXED',
      packageTitle: 'Royal Shehnai & Nagada Auspicious Troupe',
      description: '5 Traditional Shehnai masters and Nagada percussionists performing auspicious morning Muhurtham ragas (Raag Yaman & Bilawal) and grand Baraat welcome fanfares.',
      cuisineType: 'Classical Indian Auspicious Instrumental',
      regionalSpecialization: 'Royal Court Shehnai & Nagada Jugalbandi',
      menuDetails: 'Morning muhurtham shehnai, Baraat arrival nagada beats, Varmala auspicious fanfare',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 45000.0,
      guestCount: 1,
      additionalCharges: 5000.0,
      taxAmount: 2500.0,
      totalEstimatedPrice: 52500.0,
      serviceInclusions: '5 Traditional royal musicians in royal Mewari pagris, live Shehnai and Nagada acoustic performance for 4 hours',
      exclusions: 'Amplified sound system (provided by audio vendor)',
      recommended: true,
      status: 'SUBMITTED',
      enquiryId: 1,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% advance on confirmation, 50% post-performance.',
    },
    // Missing Client-Selected Quotations:
    // 1. Priya Reddy & Karthik Varma - Maharaja Catering & Events
    {
      vendorName: 'Maharaja Catering & Events',
      vendorEmail: 'vendor@royalknot.com',
      serviceCategory: 'Wedding Catering',
      packageTitle: 'Heritage Rajputana & Coastal Spice Fusion Dining',
      description: 'Exclusive royal palace Sangeet banquet blending authentic Rajputana delicacies with coastal Malabar flavours, live Nitrogen mocktail bar, and traditional silverware presentation.',
      cuisineType: 'Heritage Rajputana & Coastal Spice Fusion',
      regionalSpecialization: 'Smoked Laal Maas, Coorg Ghee Roast Prawns, Jodhpuri Mirchi Vada, Malabar Appam live station, Kesar Phirni',
      menuDetails: '5 Welcome Drinks, 14 Starters (8 Veg, 6 Non-Veg), 12 Main Courses, 4 Live Stations (Nitrogen Mocktails, Sigri Kebabs, Appam & Stew, Chaat), 5 Artisanal Desserts',
      vegetarianOptionsCount: 16,
      nonVegetarianOptionsCount: 12,
      pricePerPlate: 2100.0,
      guestCount: 350,
      additionalCharges: 75000.0,
      taxAmount: 40000.0,
      totalEstimatedPrice: 850000.0,
      serviceInclusions: 'Silver-plated tableware, 35 uniformed banquet staff, interactive liquid nitrogen mocktail bar, unlimited mineral water carafes, live station chefs',
      exclusions: 'Hard liquor and excise permit licenses',
      recommended: true,
      status: 'ACCEPTED',
      enquiryId: enquiryReddy.id,
      availability: 'Confirmed Available for Sangeet Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: 'Token advance paid (₹2,00,000). Remaining balance due 7 days prior to Sangeet. Guaranteed 350 guest minimum.',
    },
    // 2. Diya Singh & Vivaan Rajput - Maharaja Catering & Events
    {
      vendorName: 'Maharaja Catering & Events',
      vendorEmail: 'vendor@royalknot.com',
      serviceCategory: 'Wedding Catering',
      packageTitle: 'Traditional Marwari Royal Thali Banquet',
      description: 'Timeless royal Marwari feast celebrating imperial Rajasthani heritage with authentic Dal Baati Churma, Ker Sangri, Gatte ki Sabzi, live bajra rotla counters, and silver-plated tableware.',
      cuisineType: 'Traditional Marwari Desi Ghee Heritage',
      regionalSpecialization: 'Authentic Dal Baati Churma with 5 Churma varieties, Ker Sangri, Govind Gatta, Bikaneri Rasgulla, Malpua Rabdi',
      menuDetails: 'Traditional Kesar Sharbat, 10 Authentic Rajasthani Starters, 12 Royal Curries, 3 Live Traditional Stations (Live Bajra & Makka Rotla with Chutneys, Sigri Poha, Live Jalebi), 6 Desi Ghee Sweets',
      vegetarianOptionsCount: 22,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 1850.0,
      guestCount: 300,
      additionalCharges: 65000.0,
      taxAmount: 30000.0,
      totalEstimatedPrice: 650000.0,
      serviceInclusions: 'Pure desi ghee preparations, traditional Kansa/brass thali service, 30 uniformed stewards in Marwari safas, continuous table service, dessert bar styling',
      exclusions: 'Non-vegetarian dishes (strictly 100% pure vegetarian preparation)',
      recommended: false,
      status: 'ACCEPTED',
      enquiryId: enquirySingh.id,
      availability: 'Service Completed & Reconciled',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: 'Fully settled on 2026-09-17 with zero disputes. 100% payment reconciled.',
    },
    // 3. Aanya Sharma & Arjun Mehta - Saptapadi Brass Band & Royal Elephant Escort
    {
      vendorName: 'Saptapadi Brass Band & Royal Elephant Escort',
      vendorEmail: 'contact@saptapadievents.in',
      serviceCategory: 'Live Music and Traditional Bands',
      pricingModel: 'FIXED',
      packageTitle: 'Royal Baraat Brass Band, Dhol Tasha & Royal Elephant Escort',
      description: 'Grand royal Baraat procession featuring a 15-piece uniformed brass orchestra, 4 Punjabi dhol tasha masters, decorated ceremonial elephant with velvet Jhool, royal Chattar canopy, and auspicious wedding marches.',
      cuisineType: 'Royal Procession & Classical Auspicious Music',
      regionalSpecialization: 'Rajasthani Royal Baraat & Punjabi Dhol Tasha',
      menuDetails: 'Imperial palace gate fanfare, 2-hour Baraat procession brass orchestra, high-energy dhol jugalbandi, Varmala grand ceremonial bugles',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 140000.0,
      guestCount: 1,
      additionalCharges: 25000.0,
      taxAmount: 15000.0,
      totalEstimatedPrice: 180000.0,
      serviceInclusions: '15 brass musicians in royal crimson uniforms, 4 live dhol players, illuminated mobile sound unit, ceremonial umbrella (Chattar), elephant escort coordinator, vintage car sync',
      exclusions: 'Street firecracker licenses (handled by client/venue)',
      recommended: true,
      status: 'ACCEPTED',
      enquiryId: enquirySharma.id,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% booking advance, 50% on procession arrival at palace gate. Police permission arranged by vendor.',
    },
    // 4. Aanya Sharma & Arjun Mehta - Lead Priest & Vedic Troupe
    {
      vendorName: 'Lead Priest & Vedic Troupe',
      vendorEmail: 'shastris@vedictroupe.org',
      serviceCategory: 'Hindu Pandit / Purohit',
      pricingModel: 'FIXED',
      packageTitle: 'Royal Vedic Vivah Sanskar & Sacred Havan Troupe',
      description: 'Head Vedic Acharya with 4 assistant Vedic shastris conducting authentic traditional Vivah Sanskar, complete 7 Pheras with English and Hindi translation for family and guests, sacred Agni Havan, and ceremonial bridal blessing (Ashirwad).',
      cuisineType: 'Vedic Ritual Leadership & Sanskrit Chanting',
      regionalSpecialization: 'Shukla Yajurveda Vivah Vidhi & Royal Vedic Sanskar',
      menuDetails: 'Gauri Ganesh Puja, Kanyadaan, Panigrahana, Agni Pradakshina (7 Pheras), Saptapadi vows, Sindoor-daan, Ashirwad ceremony',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 45000.0,
      guestCount: 1,
      additionalCharges: 7000.0,
      taxAmount: 3000.0,
      totalEstimatedPrice: 55000.0,
      serviceInclusions: 'Head Acharya + 4 Shastris, bilingual ritual commentary (Sanskrit-Hindi-English), ceremonial havan kund arrangement, personalized Lagna Patrika scroll',
      exclusions: 'Puja samagri consumables (complete itemized shopping checklist provided 14 days in advance)',
      recommended: true,
      status: 'ACCEPTED',
      enquiryId: enquirySharma.id,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% booking dakshina advance, balance on Pheras completion. Havan kund setup completed 2 hours prior.',
    },
    // 5. Aanya Sharma & Arjun Mehta - Celebrity DJ & Live Troupe
    {
      vendorName: 'Celebrity DJ & Live Troupe',
      vendorEmail: 'bookings@celebritydjtroupe.com',
      serviceCategory: 'DJ and Sound Services',
      pricingModel: 'FIXED',
      packageTitle: 'Grand Royal Sangeet & Reception DJ Concert Experience',
      description: 'Headline celebrity club DJ with live percussionist (djembe and dhol), intelligent moving concert beam heads, haze atmosphere, and customized Bollywood, Punjabi, and commercial luxury club sets.',
      cuisineType: 'Live Electronic Music & Club Audio Production',
      regionalSpecialization: 'Bollywood Sangeet Mashups & Commercial High-Energy EDM',
      menuDetails: 'Grand bridal entrance track cues, 4-hour Sangeet/Reception concert set, live djembe percussion sync, after-party extended mixes',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 180000.0,
      guestCount: 1,
      additionalCharges: 25000.0,
      taxAmount: 15000.0,
      totalEstimatedPrice: 220000.0,
      serviceInclusions: 'Headline celebrity DJ + live percussionist, Pioneer DJ console, wireless microphone kit, pre-event playlist curation call, sound check & frequency calibration',
      exclusions: 'Overtime charges beyond agreed hours (billed separately at ₹15,000/hr upon client approval)',
      recommended: true,
      status: 'ACCEPTED',
      enquiryId: enquirySharma.id,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% booking advance, 50% sound check completion. 3-phase dedicated 63A power supply required.',
    },
    // 6. Aanya Sharma & Arjun Mehta - Sound & Lighting Team
    {
      vendorName: 'Sound & Lighting Team',
      vendorEmail: 'production@soundandlightingteam.com',
      serviceCategory: 'Lighting, Sound and Power Backup',
      pricingModel: 'FIXED',
      packageTitle: 'Palace Courtyard Architectural Illumination & Line Array Audio',
      description: 'Complete heritage palace facade uplighting (120 warm LED pars), 10,000m fairy light canopy over central courtyard, JBL VTX acoustic line array audio system, and 125kVA silent backup diesel generator.',
      cuisineType: 'Concert Grade Audio & Heritage Architectural Illumination',
      regionalSpecialization: 'Heritage Palace Facade Illumination & High-Fidelity Acoustics',
      menuDetails: 'Palace courtyard fairy light canopy, architectural uplighting on heritage pillars, JBL line array sound towers, 125kVA silent generator sync',
      vegetarianOptionsCount: 0,
      nonVegetarianOptionsCount: 0,
      pricePerPlate: 260000.0,
      guestCount: 1,
      additionalCharges: 35000.0,
      taxAmount: 25000.0,
      totalEstimatedPrice: 320000.0,
      serviceInclusions: '120 outdoor IP65 LED pars, warm fairy light canopy, JBL line array speaker towers, digital audio console, sound & lighting technicians, 125kVA silent genset with fuel',
      exclusions: 'Municipal sound permits for outdoors post 10:00 PM (handled by venue planner)',
      recommended: true,
      status: 'ACCEPTED',
      enquiryId: enquirySharma.id,
      availability: 'Confirmed Available for Wedding Date',
      validUntil: new Date('2026-12-31T23:59:59Z'),
      termsAndConditions: '50% advance on signing, 50% upon sound & lighting calibration on event eve. On-site technical support team included throughout.',
    },
  ];

  for (const q of quotations) {
    const existing = await prisma.vendorQuotation.findFirst({
      where: {
        enquiryId: q.enquiryId,
        vendorName: q.vendorName,
        packageTitle: q.packageTitle,
      },
    });

    if (existing) {
      await prisma.vendorQuotation.update({
        where: { id: existing.id },
        data: q,
      });
    } else {
      await prisma.vendorQuotation.create({
        data: q,
      });
    }
  }

  // Ensure default selected line items exist for enquirySharma.id (enquiry 1)
  const defaultLineItems = [
    {
      invoiceId: 1,
      enquiryId: enquirySharma.id,
      category: 'Mandap and Stage Decoration',
      vendorName: 'Jaipur Heritage Decor & Florists',
      vendorEmail: 'contact@jaipurheritagedecor.com',
      packageTitle: 'Royal Rajasthani Floral Mandap',
      pricingModel: 'FIXED',
      unitPrice: 450000.0,
      quantity: 1,
      baseAmount: 450000.0,
      additionalCharges: 35000.0,
      taxAmount: 24250.0,
      discountAmount: 0.0,
      lineTotal: 509250.0,
      status: 'SELECTED',
    },
    {
      invoiceId: 1,
      enquiryId: enquirySharma.id,
      category: 'Mehendi Artists',
      vendorName: 'Meera Mehendi Studio Udaipur',
      vendorEmail: 'mehendi@meeramehendi.com',
      packageTitle: 'Marwari Heritage Bridal Mehendi & Guest Team',
      pricingModel: 'FIXED',
      unitPrice: 35000.0,
      quantity: 1,
      baseAmount: 35000.0,
      additionalCharges: 5000.0,
      taxAmount: 2000.0,
      discountAmount: 0.0,
      lineTotal: 42000.0,
      status: 'SELECTED',
    },
  ];

  for (const li of defaultLineItems) {
    await prisma.invoiceLineItem.upsert({
      where: {
        enquiryId_category: {
          enquiryId: li.enquiryId,
          category: li.category,
        },
      },
      update: {},
      create: li,
    });
  }

  // 6. 25 Automated Wedding Tasks
  const defaultTasks = [
    // Venue and Logistics
    { title: 'Venue confirmation', description: 'Finalize luxury heritage palace contracts for all 3 days', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'Completed' },
    { title: 'Accommodation arrangements', description: 'Block 120 luxury suites for out-of-town guests', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'Completed' },
    { title: 'Guest transportation', description: 'Charter vintage cars for bridal party and luxury shuttles', category: 'Venue and Logistics', assignedOwner: 'Transport Lead', priority: 'MEDIUM', status: 'In Progress' },
    { title: 'Seating arrangements', description: 'Design VIP royal court and family table seating plan', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'In Progress' },
    // Design and Decoration
    { title: 'Theme finalization', description: 'Lock Royal Heritage & Gold moodboard and palette', category: 'Design and Decoration', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
    { title: 'Stage design', description: 'Fabricate bespoke carved golden mandap backdrop', category: 'Design and Decoration', assignedOwner: 'Production Lead', priority: 'CRITICAL', status: 'In Progress' },
    { title: 'Floral arrangements', description: 'Order 10,00,000 fresh marigolds, red roses & exotic orchids', category: 'Design and Decoration', assignedOwner: 'Floral Lead', priority: 'HIGH', status: 'To Plan' },
    { title: 'Lighting arrangements', description: 'Install fairy light canopy and architectural palace uplighting', category: 'Design and Decoration', assignedOwner: 'Lighting Director', priority: 'MEDIUM', status: 'To Plan' },
    // Vendor Coordination
    { title: 'Caterer confirmation', description: 'Lock Maharaja Catering & Events contract and finalize 8 live counters', category: 'Vendor Coordination', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'Completed' },
    { title: 'Photography confirmation', description: 'Contract candid luxury photographer and drone crew', category: 'Vendor Coordination', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'Completed' },
    { title: 'Videography confirmation', description: 'Brief cinematic video team for same-day edit trailer', category: 'Vendor Coordination', assignedOwner: 'Media Lead', priority: 'MEDIUM', status: 'In Progress' },
    { title: 'Entertainment arrangements', description: 'Confirm classical shehnai troupe and celebrity DJ', category: 'Vendor Coordination', assignedOwner: 'Entertainment Manager', priority: 'HIGH', status: 'In Progress' },
    // Wedding Ceremonies
    { title: 'Mehendi arrangements', description: 'Setup bohemian colorful courtyard with organic henna artists', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
    { title: 'Haldi arrangements', description: 'Design floral pool deck with yellow marigold curtains', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
    { title: 'Sangeet arrangements', description: 'Rehearse bridal dance sequence and test sound stage', category: 'Wedding Ceremonies', assignedOwner: 'Choreographer', priority: 'HIGH', status: 'In Progress' },
    { title: 'Wedding ceremony preparation', description: 'Review Vedic priest requirements, sacred fire havan kund', category: 'Wedding Ceremonies', assignedOwner: 'Lead Priest & Planner', priority: 'CRITICAL', status: 'To Plan' },
    // Reception
    { title: 'Reception stage preparation', description: 'Construct royal throne podium with floral chandeliers', category: 'Reception', assignedOwner: 'Production Lead', priority: 'HIGH', status: 'To Plan' },
    { title: 'Reception catering', description: 'Coordinate 7-course royal banquet and dessert bar', category: 'Reception', assignedOwner: 'Maharaja Catering & Events', priority: 'CRITICAL', status: 'To Plan' },
    { title: 'Guest welcome arrangements', description: 'Organize traditional rose water sprinkling & aarti welcome', category: 'Reception', assignedOwner: 'Hospitality Desk', priority: 'MEDIUM', status: 'To Plan' },
    // Additional Planning
    { title: 'Invitation design', description: 'Dispatch gold-foiled laser cut digital invitations', category: 'Additional Planning', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
    { title: 'Guest list finalization', description: 'Lock final headcount at 400 guests with RSVP validation', category: 'Additional Planning', assignedOwner: 'Couple', priority: 'CRITICAL', status: 'Completed' },
    { title: 'Return gifts', description: 'Curate silver coin keepsake boxes and artisanal sweets', category: 'Additional Planning', assignedOwner: 'Gifting Lead', priority: 'MEDIUM', status: 'In Progress' },
    { title: 'Makeup coordination', description: 'Conduct bridal trial with luxury celebrity MUA', category: 'Additional Planning', assignedOwner: 'Bridal Lead', priority: 'HIGH', status: 'In Progress' },
    { title: 'Final vendor confirmation', description: 'Conduct all-hands vendor briefing and call sheets', category: 'Additional Planning', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'To Plan' },
    { title: 'Final event checklist', description: 'Comprehensive master checklist walkthrough with couple', category: 'Additional Planning', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'To Plan' },
  ];

  for (const t of defaultTasks) {
    await prisma.weddingTask.upsert({
      where: {
        enquiryId_title: {
          enquiryId: 1,
          title: t.title,
        },
      },
      update: {
        description: t.description,
        category: t.category,
        assignedOwner: t.assignedOwner,
        priority: t.priority,
        status: t.status,
      },
      create: {
        enquiryId: 1,
        title: t.title,
        description: t.description,
        category: t.category,
        assignedOwner: t.assignedOwner,
        priority: t.priority,
        status: t.status,
      },
    });
  }

  // 7. Event Timeline Schedule
  const defaultSchedule = [
    { timeSlot: '08:00 AM', activity: 'Venue preparation & Stage Setup', assignedVendor: 'Jaipur Heritage Decor Crew', activityStatus: 'Completed', expectedCompletion: '09:30 AM', actualCompletion: '09:15 AM', delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'All floral trucks checked in at South Gate on schedule.' },
    { timeSlot: '09:00 AM', activity: 'Vendor setup & Live Kitchens', assignedVendor: 'Maharaja Catering & Events', activityStatus: 'In Progress', expectedCompletion: '11:00 AM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Kitchen equipment positioned in Palace Banquet Hall; prep underway.' },
    { timeSlot: '10:00 AM', activity: 'Groom arrival & Baraat procession', assignedVendor: 'Saptapadi Brass Band & Royal Elephant Escort', activityStatus: 'Completed', expectedCompletion: '11:00 AM', actualCompletion: '10:50 AM', delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Vintage Rolls Royce arrived on schedule; Baraat reached palace gate.' },
    { timeSlot: '11:00 AM', activity: 'Garland exchange (Varmala)', assignedVendor: 'Event Coordination Team', activityStatus: 'In Progress', expectedCompletion: '11:45 AM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Varmala revolving stage tested and ready.' },
    { timeSlot: '12:00 PM', activity: 'Wedding rituals and vows (Mandap Pheras)', assignedVendor: 'Lead Priest & Vedic Troupe', activityStatus: 'Upcoming', expectedCompletion: '01:30 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Havan kund setup completed by Vedic priests.' },
    { timeSlot: '02:00 PM', activity: 'Royal Lunch Banquet', assignedVendor: 'Maharaja Catering & Events', activityStatus: 'Delayed', expectedCompletion: '03:45 PM', actualCompletion: null, delayMinutes: 15, arrivalStatus: 'Running Late', notes: 'Dessert counter delay reported: 15 min buffer applied.' },
    { timeSlot: '06:00 PM', activity: 'Reception preparation & Sound check', assignedVendor: 'Sound & Lighting Team', activityStatus: 'Upcoming', expectedCompletion: '06:45 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Acoustics calibrated for palace courtyard.' },
    { timeSlot: '07:00 PM', activity: 'Grand Reception begins', assignedVendor: 'Celebrity DJ & Live Troupe', activityStatus: 'Upcoming', expectedCompletion: '11:30 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Not Arrived', notes: 'Expected arrival at 06:45 PM for technical briefing.' },
  ];

  for (const s of defaultSchedule) {
    await prisma.eventTimeline.upsert({
      where: {
        timeSlot_activity: {
          timeSlot: s.timeSlot,
          activity: s.activity,
        },
      },
      update: {
        assignedVendor: s.assignedVendor,
        activityStatus: s.activityStatus,
        expectedCompletion: s.expectedCompletion,
        actualCompletion: s.actualCompletion,
        delayMinutes: s.delayMinutes,
        arrivalStatus: s.arrivalStatus,
        notes: s.notes,
      },
      create: s,
    });
  }

  // 8. Additional Expenses (Distinct, non-repeating scope additions)
  const defaultExpenses = [
    { itemDescription: 'Extra 50 Catering Plates', category: 'Catering', amount: 90000.0, clientApprovalStatus: 'Approved', reason: 'Guest count updated from 400 to 450 per client request.' },
    { itemDescription: 'Extended DJ hours (2 hours)', category: 'Entertainment', amount: 30000.0, clientApprovalStatus: 'Approved', reason: 'After-party extended until 02:00 AM.' },
    { itemDescription: 'Traditional Shehnai Troupes Extension', category: 'Entertainment', amount: 25000.0, clientApprovalStatus: 'Approved', reason: 'Ceremony rituals extended by 1 hour.' },
  ];

  for (const e of defaultExpenses) {
    await prisma.additionalExpense.upsert({
      where: {
        enquiryId_itemDescription: {
          enquiryId: 1,
          itemDescription: e.itemDescription,
        },
      },
      update: {
        category: e.category,
        amount: e.amount,
        clientApprovalStatus: e.clientApprovalStatus,
        reason: e.reason,
      },
      create: {
        enquiryId: 1,
        itemDescription: e.itemDescription,
        category: e.category,
        amount: e.amount,
        clientApprovalStatus: e.clientApprovalStatus,
        reason: e.reason,
      },
    });
  }

  // 9. Payments (Distinct milestone transactions)
  const defaultPayments = [
    { milestoneTitle: 'Booking Deposit (20%)', amountDue: 500000.0, amountPaid: 500000.0, dueDate: new Date('2026-08-30'), paymentDate: new Date('2026-08-30'), status: 'PAID', transactionReference: 'TXN-DEP-88491' },
    { milestoneTitle: 'Advance Payment (40%)', amountDue: 1000000.0, amountPaid: 1000000.0, dueDate: new Date('2026-10-15'), paymentDate: new Date('2026-10-15'), status: 'PAID', transactionReference: 'TXN-ADV-99210' },
    { milestoneTitle: 'Final Settlement & Additions', amountDue: 1145000.0, amountPaid: 0.0, dueDate: new Date('2027-02-28'), status: 'PENDING', transactionReference: null },
  ];

  for (const p of defaultPayments) {
    await prisma.payment.upsert({
      where: {
        enquiryId_milestoneTitle: {
          enquiryId: 1,
          milestoneTitle: p.milestoneTitle,
        },
      },
      update: {
        amountDue: p.amountDue,
        amountPaid: p.amountPaid,
        dueDate: p.dueDate,
        paymentDate: p.paymentDate,
        status: p.status,
        transactionReference: p.transactionReference,
      },
      create: {
        enquiryId: 1,
        milestoneTitle: p.milestoneTitle,
        amountDue: p.amountDue,
        amountPaid: p.amountPaid,
        dueDate: p.dueDate,
        paymentDate: p.paymentDate,
        status: p.status,
        transactionReference: p.transactionReference,
      },
    });
  }

  // 10. Invoice (Accurately reconciled with payments and approved expenses)
  const totalApprovedExtras = 145000.0; // 90,000 + 30,000 + 25,000
  const agreedPackage = 2500000.0;
  const finalAmount = agreedPackage + totalApprovedExtras; // 2,645,000
  const amountReceived = 1500000.0; // 500,000 + 1,000,000
  const outstandingBalance = finalAmount - amountReceived; // 1,145,000

  await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-RK-2026-001' },
    update: {
      clientNames: 'Aanya Sharma & Arjun Mehta',
      agreedPackageAmount: agreedPackage,
      approvedAdditionalCosts: totalApprovedExtras,
      finalClientAmount: finalAmount,
      amountReceived,
      outstandingBalance,
      vendorPayableAmount: 1450000.0,
      paymentStatus: 'PARTIALLY_PAID',
    },
    create: {
      invoiceNumber: 'INV-RK-2026-001',
      clientNames: 'Aanya Sharma & Arjun Mehta',
      agreedPackageAmount: agreedPackage,
      approvedAdditionalCosts: totalApprovedExtras,
      finalClientAmount: finalAmount,
      amountReceived,
      outstandingBalance,
      vendorPayableAmount: 1450000.0,
      paymentStatus: 'PARTIALLY_PAID',
      dueDate: new Date('2027-02-28'),
    },
  });

  // 11. Notifications (5 Distinct system notifications)
  const defaultNotifications = [
    { title: 'New Enquiry Submitted', message: 'Aanya Sharma & Arjun Mehta requested Full-Service Wedding for 400 guests.', type: 'ENQUIRY_SUBMITTED', targetRole: 'ROLE_PLANNER', isRead: false },
    { title: '3 Catering Proposals Received', message: 'Maharaja Catering, Deccan Royal Kitchens and Annapurna Caterers submitted catering quotes for comparison.', type: 'QUOTATION_RECEIVED', targetRole: 'ROLE_PLANNER', isRead: false },
    { title: 'Vendor Status Alert', message: 'Maharaja Catering & Events reported Running Late for Lunch Banquet dessert prep.', type: 'ARRIVAL_ALERT', targetRole: 'ROLE_PLANNER', isRead: false },
    { title: 'Service Agreement Ready', message: 'Digital contract AGR-2026-SHARMA-01 dispatched for Aanya & Arjun Mehta.', type: 'AGREEMENT_DISPATCHED', targetRole: 'ROLE_CLIENT', isRead: false },
    { title: 'Deposit Payment Confirmed', message: '₹5,00,000 received for Booking Deposit. Reference #TXN-DEP-88491.', type: 'PAYMENT_RECEIVED', targetRole: 'ROLE_ADMIN', isRead: true },
  ];

  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({ data: defaultNotifications });

  // 12. Vendor Events (Ongoing, Upcoming, Past) for vendor@royalknot.com
  const defaultVendorEvents = [
    {
      vendorEmail: 'vendor@royalknot.com',
      vendorName: 'Maharaja Catering & Events',
      eventName: 'The Sharma & Mehta Royal Wedding',
      clientName: 'Aanya Sharma & Arjun Mehta',
      eventDate: new Date('2026-11-01T09:00:00Z'),
      venue: 'City Palace, Udaipur, Rajasthan',
      guestCount: 400,
      serviceType: 'Royal Mewari, Awadhi & Mughlai Heritage Feast',
      requirements: '8 Live multi-cuisine counters, antique copper chafing dishes, 45 uniformed banquet staff, signature Awadhi dessert bar.',
      acceptedQuotationAmount: 1050000.0,
      category: 'ONGOING',
      eventStatus: 'In Progress',
      expectedServiceTime: '09:00 AM - 04:00 PM',
      arrivalStatus: 'Arrived',
      serviceProgress: 'Kitchen positioned in Palace Banquet Hall; lunch buffet live stations active',
      paymentStatus: 'Advance Deposit Paid (₹5,25,000 / 50%)',
      completionNotes: null,
    },
    {
      vendorEmail: 'vendor@royalknot.com',
      vendorName: 'Maharaja Catering & Events',
      eventName: 'The Reddy & Varma Palace Sangeet',
      clientName: 'Priya Reddy & Karthik Varma',
      eventDate: new Date('2026-12-18T18:00:00Z'),
      venue: 'Umaid Bhawan Palace, Jodhpur',
      guestCount: 350,
      serviceType: 'Heritage Rajputana & Coastal Spice Fusion Dining',
      requirements: 'Royal Thali service, Nitrogen mocktail bar, 35 uniformed banquet staff, pure ghee sweets.',
      acceptedQuotationAmount: 850000.0,
      category: 'UPCOMING',
      eventStatus: 'Confirmed',
      expectedServiceTime: '06:00 PM - 01:00 AM',
      arrivalStatus: 'Not Arrived',
      serviceProgress: 'Menu tasting confirmed; raw material sourcing scheduled 5 days prior',
      paymentStatus: 'Token Advance Paid (₹2,00,000)',
      completionNotes: null,
    },
    {
      vendorEmail: 'vendor@royalknot.com',
      vendorName: 'Maharaja Catering & Events',
      eventName: 'The Singh & Rajput Heritage Wedding',
      clientName: 'Diya Singh & Vivaan Rajput',
      eventDate: new Date('2026-09-15T11:00:00Z'),
      venue: 'Rambagh Palace, Jaipur',
      guestCount: 300,
      serviceType: 'Traditional Marwari Royal Thali',
      requirements: 'Dal Baati Churma, Ker Sangri live counters, silver-plated tableware.',
      acceptedQuotationAmount: 650000.0,
      category: 'PAST',
      eventStatus: 'Completed',
      expectedServiceTime: '11:00 AM - 05:00 PM',
      arrivalStatus: 'Service Completed',
      serviceProgress: 'Event concluded with zero culinary delays; 100% guest satisfaction rating',
      paymentStatus: 'Fully Settled (100% Paid)',
      completionNotes: 'Full settlement of ₹6,50,000 reconciled on 2026-09-17 with zero disputes.',
    },
  ];

  await prisma.vendorEvent.deleteMany({});
  await prisma.vendorEvent.createMany({ data: defaultVendorEvents });

  // Ensure quotations have enquiryId and terms
  await prisma.vendorQuotation.updateMany({
    where: { enquiryId: null },
    data: { enquiryId: 1 },
  });

  console.log('✅ Royal Knot database seeded successfully with all modules and vendor events!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
