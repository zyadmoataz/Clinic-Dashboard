import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceptionist } from './add-receptionist';

describe('AddReceptionist', () => {
  let component: AddReceptionist;
  let fixture: ComponentFixture<AddReceptionist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReceptionist],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReceptionist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
