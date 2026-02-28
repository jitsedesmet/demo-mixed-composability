"use strict";
// Test that BusFunctionFactorySelective.publish() works correctly for deactivated functions

const { BusFunctionFactorySelective, functionFactoryDeactivateKey } = require('/home/runner/work/demo-mixed-composability/demo-mixed-composability/comunica/packages/bus-function-factory/lib/index.js');
const { ActionContext } = require('@comunica/core');

// Create the selective bus
const bus = new BusFunctionFactorySelective({ name: 'test-bus' });

console.log('bus.actorsIndex:', JSON.stringify(Object.keys(bus.actorsIndex)));

// Create a mock actor for langmatches 
const mockActor = {
  name: 'mock-langmatches',
  functionNames: ['langmatches'],
  test: () => Promise.resolve({ type: 'pass' }),
  run: () => Promise.resolve({}),
};

// Subscribe the actor to the bus
bus.subscribe(mockActor);
console.log('After subscribe, actorsIndex keys:', JSON.stringify(Object.keys(bus.actorsIndex)));
console.log('actorsIndex.langmatches:', bus.actorsIndex['langmatches']?.length);
console.log('actorsIndex._undefined_:', bus.actorsIndex._undefined_?.length);

// Create a deactivated context
const context = new ActionContext({
  [functionFactoryDeactivateKey.name]: ['langmatches'],
});

// Test publish with deactivated langmatches
const action = {
  functionName: 'langmatches',
  context,
};

const replies = bus.publish(action);
console.log('Replies length:', replies.length);
if (replies.length > 0) {
  replies[0].reply.then(r => console.log('Reply isPassed:', r.isPassed())).catch(e => console.log('Error:', e));
}
