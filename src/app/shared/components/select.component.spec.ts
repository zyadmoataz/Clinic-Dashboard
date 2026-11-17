import { TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  it('updates signal display label on selectItem and clears on writeValue("")', () => {
    TestBed.configureTestingModule({ imports: [SelectComponent] });
    const fixture = TestBed.createComponent(SelectComponent);
    const comp = fixture.componentInstance;

    fixture.componentRef.setInput('placeholder', 'Select Service');
    fixture.componentRef.setInput('options', [
      { value: '1', label: 'Cardiac Consultation' },
      { value: '9', label: 'Neurology Consult' },
    ]);
    fixture.detectChanges();

    expect(comp.getDisplayLabel()).toBe('Select Service');

    comp.selectItem('9');
    expect(comp.getDisplayLabel()).toBe('Neurology Consult');
    expect(comp.isItemSelected('9')).toBe(true);

    comp.writeValue('');
    expect(comp.getDisplayLabel()).toBe('Select Service');
    expect(comp.hasSelectedValue()).toBe(false);
  });
});
