import { describe, expect, it } from 'vitest'
import {
  clampScore,
  confidenceLabel,
  confidenceLabelFromScore,
  confidenceLevelFromScore,
} from './confidence'

describe('confidence scoring', () => {
  it('clamps scores into 0..100 and rounds', () => {
    expect(clampScore(-20)).toBe(0)
    expect(clampScore(140)).toBe(100)
    expect(clampScore(72.6)).toBe(73)
    expect(clampScore(Number.NaN)).toBe(0)
  })

  it('buckets scores into the canonical confidence levels', () => {
    expect(confidenceLevelFromScore(98)).toBe('high')
    expect(confidenceLevelFromScore(90)).toBe('high')
    expect(confidenceLevelFromScore(85)).toBe('verified')
    expect(confidenceLevelFromScore(75)).toBe('verified')
    expect(confidenceLevelFromScore(60)).toBe('review')
    expect(confidenceLevelFromScore(50)).toBe('review')
    expect(confidenceLevelFromScore(49)).toBe('low')
    expect(confidenceLevelFromScore(0)).toBe('low')
  })

  it('maps levels to human labels', () => {
    expect(confidenceLabel('high')).toBe('High Trust')
    expect(confidenceLabel('verified')).toBe('Verified')
    expect(confidenceLabel('review')).toBe('Needs Review')
    expect(confidenceLabel('low')).toBe('Low Confidence')
    expect(confidenceLabelFromScore(98)).toBe('High Trust')
    expect(confidenceLabelFromScore(40)).toBe('Low Confidence')
  })
})
