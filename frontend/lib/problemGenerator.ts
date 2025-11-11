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
    const a = this.randomInt(this.settings.addition_min, this.settings.addition_max);
    const b = this.randomInt(this.settings.addition_min, this.settings.addition_max);
    return {
      question: `${a} + ${b}`,
      answer: a + b,
      operation: 'addition',
    };
  }

  private generateSubtraction(): MathProblem {
    // Generate A and B from [2,100], then compute (A+B) - A or (A+B) - B
    // This ensures the answer is never 1 (minimum is 2)
    const a = this.randomInt(this.settings.subtraction_min, this.settings.subtraction_max);
    const b = this.randomInt(this.settings.subtraction_min, this.settings.subtraction_max);
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
    // One number from [2,12], other from [2,100]
    const a = this.randomInt(this.settings.multiplication_min, this.settings.multiplication_max);
    const b = this.randomInt(2, 100);
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
    // Divisor from [2,12], quotient from [2,100]
    const divisor = this.randomInt(this.settings.division_min, this.settings.division_max);
    const quotient = this.randomInt(2, 100);
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
  addition_min: 2,
  addition_max: 100,
  subtraction_enabled: true,
  subtraction_min: 2,
  subtraction_max: 100,
  multiplication_enabled: true,
  multiplication_min: 2,
  multiplication_max: 12,
  division_enabled: true,
  division_min: 2,
  division_max: 12,
};

export function isUsingDefaultSettings(settings: Settings): boolean {
  return (
    settings.addition_enabled === DEFAULT_SETTINGS.addition_enabled &&
    settings.addition_min === DEFAULT_SETTINGS.addition_min &&
    settings.addition_max === DEFAULT_SETTINGS.addition_max &&
    settings.subtraction_enabled === DEFAULT_SETTINGS.subtraction_enabled &&
    settings.subtraction_min === DEFAULT_SETTINGS.subtraction_min &&
    settings.subtraction_max === DEFAULT_SETTINGS.subtraction_max &&
    settings.multiplication_enabled === DEFAULT_SETTINGS.multiplication_enabled &&
    settings.multiplication_min === DEFAULT_SETTINGS.multiplication_min &&
    settings.multiplication_max === DEFAULT_SETTINGS.multiplication_max &&
    settings.division_enabled === DEFAULT_SETTINGS.division_enabled &&
    settings.division_min === DEFAULT_SETTINGS.division_min &&
    settings.division_max === DEFAULT_SETTINGS.division_max
  );
}
