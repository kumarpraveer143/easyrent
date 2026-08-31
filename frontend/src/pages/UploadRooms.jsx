import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Page,
  PageHeader,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Alert,
  money,
} from "../components/UI";
import { roomSchema, ROOM_TYPES } from "../lib/validation";
import useForm from "../lib/useForm";

export default function UploadRooms() {
  const navigate = useNavigate();

  const { field, values, handleSubmit, submitting, formError } = useForm({
    schema: roomSchema,
    initialValues: {
      roomNumber: "",
      rentPrice: "",
      roomType: "single",
      numberOfRooms: "1",
      numberOfBathrooms: "1",
      address: { street: "", city: "", state: "", zipCode: "" },
    },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/rooms`, data, {
          withCredentials: true,
        });
        toast.success("Room listed");
        navigate("/landowner-rooms");
      } catch (err) {
        const body = err.response?.data;
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : { _: body?.message ?? "We couldn't save that room. Try again." }),
        });
      }
    },
  });

  const rent = Number(values.rentPrice);

  return (
    <Page width="narrow">
      <PageHeader
        title="List a room"
        description="Add a room so renters can find and apply for it."
      />

      <form onSubmit={handleSubmit} noValidate>
        {formError && <Alert tone="danger" className="mb-5">{formError}</Alert>}

        <Card className="mb-5">
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Room number"
                required
                inputMode="numeric"
                placeholder="101"
                {...field("roomNumber")}
              />
              <Select label="Room type" required {...field("roomType")}>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            <Input
              label="Monthly rent"
              required
              inputMode="numeric"
              placeholder="14500"
              hint={
                Number.isFinite(rent) && rent > 0
                  ? `Renters will see ${money(rent)} per month`
                  : "In rupees, per month"
              }
              {...field("rentPrice")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Number of rooms"
                required
                inputMode="numeric"
                {...field("numberOfRooms")}
              />
              <Input
                label="Number of bathrooms"
                required
                inputMode="numeric"
                {...field("numberOfBathrooms")}
              />
            </div>
          </CardBody>
        </Card>

        <Card className="mb-5">
          <CardBody className="flex flex-col gap-4">
            <Input label="Street address" required {...field("address.street")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="City" required {...field("address.city")} />
              <Input label="State" required {...field("address.state")} />
              <Input
                label="PIN code"
                required
                inputMode="numeric"
                placeholder="560001"
                {...field("address.zipCode")}
              />
            </div>
          </CardBody>
        </Card>

        {/* Photos are the single biggest gap in the listing experience — the
            app has never supported them. Say so rather than quietly shipping
            a listing with a stock image. (B19/B20.) */}
        <Alert tone="info" className="mb-5">
          Photo upload isn&rsquo;t available yet. Listings currently show a
          placeholder instead of pictures of the actual room.
        </Alert>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" loading={submitting}>
            {submitting ? "Listing…" : "List this room"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </Page>
  );
}
