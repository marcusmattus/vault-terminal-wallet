import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { analyzeAddressRisk, RiskAnalysis } from '../utils/blockchain';
import { ChainType } from '../constants/chains';
import { TerminalCard } from './TerminalCard';
import { PromptLine } from './PromptLine';
import { BlinkCursor } from './BlinkCursor';
import { RiskBadge } from './RiskBadge';

interface SecurityScannerProps {
  address: string;
  chainType: ChainType;
  amount?: number;
  onComplete?: (analysis: RiskAnalysis) => void;
}

export const SecurityScanner: React.FC<SecurityScannerProps> = ({
  address,
  chainType,
  amount,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);

  const scanSteps = [
    { text: `resolving ${chainType.toLowerCase()} address...`, delay: 0 },
    { text: 'checking blacklist database...', delay: 400 },
    { text: 'querying AML screening...', delay: 800 },
    { text: 'analyzing transaction patterns...', delay: 1200 },
    { text: 'scoring risk factors...', delay: 1600 },
    { text: 'analysis complete.', delay: 2000, highlight: true },
  ];

  const visibleSteps = Math.floor((progress / 100) * scanSteps.length);

  useEffect(() => {
    const runScan = async () => {
      // Animate progress
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 4;
        });
      }, 40);

      // Perform actual risk analysis
      const result = await analyzeAddressRisk(address, chainType, amount);
      setAnalysis(result);

      // Wait for animation to complete
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        onComplete?.(result);
      }, 2500);

      return () => clearInterval(interval);
    };

    runScan();
  }, [address, chainType, amount]);

  return (
    <TerminalCard glow>
      <Text style={styles.scanLabel}>SECURITY SCAN IN PROGRESS</Text>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Scan Steps */}
      <View style={styles.scanLog}>
        {scanSteps.slice(0, visibleSteps).map((step, i) => (
          <PromptLine
            key={i}
            color={step.highlight ? Colors.greenPrimary : i === visibleSteps - 1 ? Colors.greenPrimary : Colors.textMuted}
            dim={i < visibleSteps - 1 && !step.highlight}
          >
            {step.text}
            {i === visibleSteps - 1 && progress < 100 && <BlinkCursor />}
          </PromptLine>
        ))}
      </View>

      {/* Risk Analysis Results */}
      {progress === 100 && analysis && (
        <View style={styles.results}>
          <View style={styles.divider} />

          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>RISK ASSESSMENT</Text>
            <RiskBadge score={analysis.score} />
          </View>

          {/* Risk Factors */}
          {analysis.factors.length > 0 && (
            <View style={styles.factors}>
              {analysis.factors.map((factor, i) => (
                <View key={i} style={styles.factor}>
                  <View style={[
                    styles.factorDot,
                    {
                      backgroundColor:
                        factor.severity === 'high' ? Colors.redDanger :
                        factor.severity === 'medium' ? Colors.yellowWarning :
                        Colors.greenPrimary
                    }
                  ]} />
                  <View style={styles.factorContent}>
                    <Text style={styles.factorCategory}>{factor.category}</Text>
                    <Text style={styles.factorDescription}>{factor.description}</Text>
                  </View>
                  <Text style={styles.factorPoints}>+{factor.points}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          <View style={styles.recommendations}>
            <Text style={styles.recommendLabel}>RECOMMENDATIONS</Text>
            {analysis.recommendations.map((rec, i) => (
              <PromptLine key={i} color={Colors.cyanAccent} indent>
                {rec}
              </PromptLine>
            ))}
          </View>

          {/* Chain-Specific Info */}
          <View style={styles.chainInfo}>
            <Text style={styles.chainInfoText}>
              ✓ Scanned on {chainType} network
            </Text>
            {analysis.factors.length === 0 && (
              <Text style={styles.chainInfoText}>
                ✓ No security concerns detected
              </Text>
            )}
          </View>
        </View>
      )}
    </TerminalCard>
  );
};

const styles = StyleSheet.create({
  scanLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  progressBar: {
    backgroundColor: '#0a0f14',
    borderRadius: 2,
    height: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.greenPrimary,
    shadowColor: 'rgba(0,255,136,0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  scanLog: {
    marginBottom: 8,
  },
  results: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  factors: {
    marginTop: 8,
    gap: 8,
  },
  factor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 8,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: Colors.yellowWarning,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  factorContent: {
    flex: 1,
  },
  factorCategory: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  factorDescription: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  factorPoints: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    color: Colors.yellowWarning,
  },
  recommendations: {
    marginTop: 12,
  },
  recommendLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chainInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.greenFaint,
  },
  chainInfoText: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.greenPrimary,
    lineHeight: 16,
  },
});
