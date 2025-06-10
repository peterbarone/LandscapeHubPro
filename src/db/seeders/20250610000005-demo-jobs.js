'use strict';
const { v4: uuidv4 } = require('uuid');
const { COMPANY_IDS } = require('./20250610000001-demo-companies');
const { CLIENT_IDS } = require('./20250610000003-demo-clients');
const { PROPERTY_IDS } = require('./20250610000004-demo-properties');
const { USER_IDS } = require('./20250610000002-demo-users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Today's date for scheduling reference
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    return queryInterface.bulkInsert('Jobs', [
      {
        id: uuidv4(),
        companyId: COMPANY_IDS.GREEN_GARDENS,
        propertyId: PROPERTY_IDS.GREEN_GARDENS_PROPERTY1,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT1,
        title: 'Weekly Lawn Maintenance',
        description: 'Regular weekly mowing, edging, and blowing of the property.',
        status: 'scheduled',
        jobType: 'maintenance',
        scheduledDate: tomorrow.toISOString().split('T')[0],
        scheduledStartTime: '09:00:00',
        scheduledEndTime: '11:00:00',
        actualStartTime: null,
        actualEndTime: null,
        estimatedDuration: 120, // 2 hours in minutes
        isRecurring: true,
        recurringPattern: JSON.stringify({
          frequency: 'weekly',
          dayOfWeek: tomorrow.getDay(),
          interval: 1
        }),
        priority: 'medium',
        assignedTo: [USER_IDS.GREEN_GARDENS_CREW],
        notes: 'Make sure to check irrigation system.',
        estimatedCost: 85.00,
        actualCost: null,
        invoiceId: null,
        weatherConditions: null,
        serviceItems: JSON.stringify({
          mowing: { completed: false, notes: '' },
          edging: { completed: false, notes: '' },
          blowing: { completed: false, notes: '' }
        }),
        completionNotes: null,
        clientSignature: null,
        completionPhotos: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: COMPANY_IDS.GREEN_GARDENS,
        propertyId: PROPERTY_IDS.GREEN_GARDENS_PROPERTY3,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT2,
        title: 'Spring Cleanup and Mulching',
        description: 'Spring cleanup of property, including debris removal, mulching, and shrub pruning.',
        status: 'completed',
        jobType: 'cleanup',
        scheduledDate: lastWeek.toISOString().split('T')[0],
        scheduledStartTime: '08:00:00',
        scheduledEndTime: '16:00:00',
        actualStartTime: new Date(lastWeek.setHours(8, 15)),
        actualEndTime: new Date(lastWeek.setHours(15, 45)),
        estimatedDuration: 480, // 8 hours in minutes
        isRecurring: false,
        recurringPattern: null,
        priority: 'high',
        assignedTo: [USER_IDS.GREEN_GARDENS_MANAGER, USER_IDS.GREEN_GARDENS_CREW],
        notes: 'Client requested extra attention to front flower beds.',
        estimatedCost: 650.00,
        actualCost: 675.00,
        invoiceId: uuidv4(), // Placeholder for an invoice ID
        weatherConditions: JSON.stringify({
          condition: 'sunny',
          temperature: 68,
          precipitation: 0
        }),
        serviceItems: JSON.stringify({
          cleanup: { completed: true, notes: 'All debris removed' },
          mulching: { completed: true, notes: '10 cubic yards of mulch applied' },
          pruning: { completed: true, notes: 'All shrubs pruned' }
        }),
        completionNotes: 'Job completed successfully. Client very satisfied with the mulch color and application.',
        clientSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAW', // Truncated signature data
        completionPhotos: ['https://storage.example.com/job-photos/123456-1.jpg', 'https://storage.example.com/job-photos/123456-2.jpg'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: COMPANY_IDS.GREEN_GARDENS,
        propertyId: PROPERTY_IDS.GREEN_GARDENS_PROPERTY2,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT1,
        title: 'Irrigation System Startup',
        description: 'Annual irrigation system startup, including inspection, repair, and programming.',
        status: 'draft',
        jobType: 'irrigation',
        scheduledDate: nextWeek.toISOString().split('T')[0],
        scheduledStartTime: '13:00:00',
        scheduledEndTime: '16:00:00',
        actualStartTime: null,
        actualEndTime: null,
        estimatedDuration: 180, // 3 hours in minutes
        isRecurring: false,
        recurringPattern: null,
        priority: 'medium',
        assignedTo: null, // Not assigned yet
        notes: 'System was winterized last November, should be in good condition.',
        estimatedCost: 225.00,
        actualCost: null,
        invoiceId: null,
        weatherConditions: null,
        serviceItems: JSON.stringify({
          inspection: { completed: false, notes: '' },
          repair: { completed: false, notes: '' },
          programming: { completed: false, notes: '' }
        }),
        completionNotes: null,
        clientSignature: null,
        completionPhotos: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: COMPANY_IDS.BLUE_SKY,
        propertyId: PROPERTY_IDS.BLUE_SKY_PROPERTY1,
        clientId: CLIENT_IDS.BLUE_SKY_CLIENT1,
        title: 'Drought-Resistant Landscape Maintenance',
        description: 'Monthly maintenance of drought-resistant landscape areas.',
        status: 'scheduled',
        jobType: 'maintenance',
        scheduledDate: tomorrow.toISOString().split('T')[0],
        scheduledStartTime: '10:00:00',
        scheduledEndTime: '12:00:00',
        actualStartTime: null,
        actualEndTime: null,
        estimatedDuration: 120, // 2 hours in minutes
        isRecurring: true,
        recurringPattern: JSON.stringify({
          frequency: 'monthly',
          dayOfMonth: tomorrow.getDate(),
          interval: 1
        }),
        priority: 'medium',
        assignedTo: [USER_IDS.BLUE_SKY_CREW],
        notes: 'Check drip irrigation system efficiency.',
        estimatedCost: 95.00,
        actualCost: null,
        invoiceId: null,
        weatherConditions: null,
        serviceItems: JSON.stringify({
          pruning: { completed: false, notes: '' },
          weedControl: { completed: false, notes: '' },
          irrigation: { completed: false, notes: '' }
        }),
        completionNotes: null,
        clientSignature: null,
        completionPhotos: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: COMPANY_IDS.BLUE_SKY,
        propertyId: PROPERTY_IDS.BLUE_SKY_PROPERTY2,
        clientId: CLIENT_IDS.BLUE_SKY_CLIENT2,
        title: 'Native Plant Garden Installation',
        description: 'Installation of California native plant garden in front yard.',
        status: 'in_progress',
        jobType: 'planting',
        scheduledDate: today.toISOString().split('T')[0],
        scheduledStartTime: '08:00:00',
        scheduledEndTime: '17:00:00',
        actualStartTime: new Date(today.setHours(8, 10)),
        actualEndTime: null,
        estimatedDuration: 540, // 9 hours in minutes
        isRecurring: false,
        recurringPattern: null,
        priority: 'high',
        assignedTo: [USER_IDS.BLUE_SKY_ADMIN, USER_IDS.BLUE_SKY_CREW],
        notes: 'Client selected plants from approved California native list.',
        estimatedCost: 1200.00,
        actualCost: null,
        invoiceId: null,
        weatherConditions: JSON.stringify({
          condition: 'sunny',
          temperature: 72,
          precipitation: 0
        }),
        serviceItems: JSON.stringify({
          soilPrep: { completed: true, notes: 'Soil amendments added' },
          planting: { completed: false, notes: 'In progress, 50% complete' },
          mulching: { completed: false, notes: 'Not started' }
        }),
        completionNotes: null,
        clientSignature: null,
        completionPhotos: ['https://storage.example.com/job-photos/789123-1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Jobs', null, {});
  }
};
