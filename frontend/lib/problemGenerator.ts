import { Settings, MathProblem } from './types';

export class ProblemGenerator {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  generateProblem(): MathProblem {
    const enabledOperations: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = [];

    if (this.settings.addition_enabled) enabledOperations.push('addition');
    if (this.settings.subtraction_enabled) enabledOperations.push('subtraction');
    if (this.settings.multiplication_enabled) enabledOperations.push('multiplication');
    if (this.settings.division_enabled) enabledOperations.push('division');

    if (enabledOperations.length === 0) {
      // Default to multiplication if nothing is enabled
      enabledOperations.push('multiplication');
    }

    const operation = enabledOperations[Math.floor(Math.random() * enabledOperations.length)];

    switch (operation) {
      case 'addition':
        return this.generateAddition();
      case 'subtraction':
        return this.generateSubtraction();
      case 'multiplication':
        return this.generateMultiplication();
      case 'division':
        return this.generateDivision();
    }
  }

  private generateAddition(): MathProblem {
    const a = this.randomInt(this.settings.addition_min1, this.settings.addition_max1);
    const b = this.randomInt(this.settings.addition_min2, this.settings.addition_max2);
    return {
      question: `${a} + ${b}`,
      answer: a + b,
      operation: 'addition',
    };
  }

  private generateSubtraction(): MathProblem {
    // Generate A and B from their respective ranges, then compute (A+B) - A or (A+B) - B
    // This ensures the answer is never 1 (minimum is 2)
    const a = this.randomInt(this.settings.subtraction_min1, this.settings.subtraction_max1);
    const b = this.randomInt(this.settings.subtraction_min2, this.settings.subtraction_max2);
    const sum = a + b;

    // Randomly choose to subtract either A or B from the sum
    if (Math.random() < 0.5) {
      return {
        question: `${sum} - ${a}`,
        answer: b,
        operation: 'subtraction',
      };
    } else {
      return {
        question: `${sum} - ${b}`,
        answer: a,
        operation: 'subtraction',
      };
    }
  }

  private generateMultiplication(): MathProblem {
    // First number from min1-max1, second from min2-max2
    const a = this.randomInt(this.settings.multiplication_min1, this.settings.multiplication_max1);
    const b = this.randomInt(this.settings.multiplication_min2, this.settings.multiplication_max2);
    // Randomly decide the order
    if (Math.random() < 0.5) {
      return {
        question: `${a} × ${b}`,
        answer: a * b,
        operation: 'multiplication',
      };
    } else {
      return {
        question: `${b} × ${a}`,
        answer: a * b,
        operation: 'multiplication',
      };
    }
  }

  private generateDivision(): MathProblem {
    // Divisor from min1-max1, quotient from min2-max2
    const divisor = this.randomInt(this.settings.division_min1, this.settings.division_max1);
    const quotient = this.randomInt(this.settings.division_min2, this.settings.division_max2);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      operation: 'division',
    };
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export const DEFAULT_SETTINGS: Settings = {
  addition_enabled: true,
  addition_min1: 2,
  addition_max1: 100,
  addition_min2: 2,
  addition_max2: 100,
  subtraction_enabled: true,
  subtraction_min1: 2,
  subtraction_max1: 100,
  subtraction_min2: 2,
  subtraction_max2: 100,
  multiplication_enabled: true,
  multiplication_min1: 2,
  multiplication_max1: 12,
  multiplication_min2: 2,
  multiplication_max2: 100,
  division_enabled: true,
  division_min1: 2,
  division_max1: 12,
  division_min2: 2,
  division_max2: 100,
};

export function isUsingDefaultSettings(settings: Settings): boolean {
  return (
    settings.addition_enabled === DEFAULT_SETTINGS.addition_enabled &&
    settings.addition_min1 === DEFAULT_SETTINGS.addition_min1 &&
    settings.addition_max1 === DEFAULT_SETTINGS.addition_max1 &&
    settings.addition_min2 === DEFAULT_SETTINGS.addition_min2 &&
    settings.addition_max2 === DEFAULT_SETTINGS.addition_max2 &&
    settings.subtraction_enabled === DEFAULT_SETTINGS.subtraction_enabled &&
    settings.subtraction_min1 === DEFAULT_SETTINGS.subtraction_min1 &&
    settings.subtraction_max1 === DEFAULT_SETTINGS.subtraction_max1 &&
    settings.subtraction_min2 === DEFAULT_SETTINGS.subtraction_min2 &&
    settings.subtraction_max2 === DEFAULT_SETTINGS.subtraction_max2 &&
    settings.multiplication_enabled === DEFAULT_SETTINGS.multiplication_enabled &&
    settings.multiplication_min1 === DEFAULT_SETTINGS.multiplication_min1 &&
    settings.multiplication_max1 === DEFAULT_SETTINGS.multiplication_max1 &&
    settings.multiplication_min2 === DEFAULT_SETTINGS.multiplication_min2 &&
    settings.multiplication_max2 === DEFAULT_SETTINGS.multiplication_max2 &&
    settings.division_enabled === DEFAULT_SETTINGS.division_enabled &&
    settings.division_min1 === DEFAULT_SETTINGS.division_min1 &&
    settings.division_max1 === DEFAULT_SETTINGS.division_max1 &&
    settings.division_min2 === DEFAULT_SETTINGS.division_min2 &&
    settings.division_max2 === DEFAULT_SETTINGS.division_max2
  );
}
